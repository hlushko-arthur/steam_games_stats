import express from 'express';

const router = express.Router()
const API_KEY = process.env.STEAM_API_KEY;

import Steam from './steam.collection.js';

router.get('/get_user_data', async (req, res) => {
	const steamID = req.query.steamID;

	const steamData = await Steam.findOne({
		"user.steamId": steamID
	})

	// if (steamData) {
	// 	res.status(200).json({ status: true, data: steamData });
	// 	return;
	// }

	try {
		let games = await getUserGames(steamID);

		// games = games.slice(0, 5);

		await Promise.all(games.map(async (game) => {
			const userAchievements = await checkGameAchievements(game, steamID);

			game.userAchievements = userAchievements;

			const gameAchievements = await getGameAchievements(game.appid);

			game.achievements = gameAchievements;
		}))

		games = games.map((game) => {
			return {
				playtime: game.playtime_forever,
				icon: game.img_icon_url,
				_id: game.appid,
				name: game.name,
				lastDatePlayed: game.rtime_last_played,
				achievements: game.achievements,
				userAchievements: game.userAchievements
			}
		})

		const user = await getUserInformation(steamID);

		let steamSchema = await Steam.findOne({
			"user.steamId": steamID
		})

		if (!steamSchema) {
			steamSchema = new Steam({
				user: user,
				games: games
			})

			await steamSchema.save();
		} else {
			await Steam.updateOne({
				"user.steamId": steamID
			}, {
				user: user,
				games: games
			});
		}

		res.status(200).json({ status: true, data: steamSchema });
	} catch (error) {
		console.log(error);
		res.status(400).json(error)
	}
})

async function getUserInformation(steamId) {
	const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;

	const response = await fetch(url);
	const data = await response.json();

	const userData = data.response.players[0];

	return {
		name: userData.personaname,
		avatar: userData.avatarhash,
		timeCreated: userData.timecreated,
		steamId: userData.steamid,
	}
}

async function getGameAchievements(appId) {
	const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}`;

	const response = await fetch(url);
	const data = await response.json();

	const regex = /\/([A-z0-9]*)\.jpg/

	let achievements = data.game?.availableGameStats?.achievements || [];

	return achievements.map((achievement) => {
		return {
			icon: achievement.icon.match(regex)[1],
			iconGray: achievement.icongray.match(regex)[1],
			displayName: achievement.displayName,
			name: achievement.name,
			description: achievement.description
		}
	});

}

async function getUserGames(steamID) {
	const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${API_KEY}&steamid=${steamID}&include_appinfo=true&include_played_free_games=true`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		return data.response.games || [];
	} catch (error) {
		console.log(error);
		return;
	}
}

async function checkGameAchievements(game, steamID) {
	const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${steamID}&appid=${game.appid}`;

	const response = await fetch(url);
	const data = await response.json();

	return (data.playerstats.achievements || []).filter((achievement) => achievement.achieved).map((achievement) => {
		return {
			name: achievement.apiname,
			unlockTime: achievement.unlocktime
		}
	});
}

async function getSteamId(username) {
	const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${API_KEY}&vanityurl=${username}`
	const response = await fetch(url);
	const data = await response.json();

	return data.response.steamid;

}

export default router;