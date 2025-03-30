import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import hltb from 'howlongtobeat';

import User from './user.collection.js';

const hltbService = new hltb.HowLongToBeatService();
const router = express.Router()
const API_KEY = process.env.STEAM_API_KEY;

router.get('/fetch_profile',
	async (req, res) => {
		try {
			const steamId = req.query.steamID;

			const _user = await User.findOne({
				"user.steamId": steamId
			})

			if (_user) {
				res.status(200).json({ status: true, data: _clearResponse(_user) });
				return;
			}

			await _checkTokenState(steamId);

			const accessToken = (await User.findOne({
				steamId: steamId
			}))?.ACCESS_TOKEN || '';

			let games = await getUserGames(steamId, accessToken)

			games.sort((a, b) => {
				if (a.rtime_last_played < b.rtime_last_played) {
					return 1;
				}

				return -1;
			});

			await Promise.all(games.map(async (game) => {
				const gameAchievements = await getGameAchievements(game.appid, steamId);

				game.achievements = gameAchievements.sort((a, b) => {
					return (a.unlockTime || 0) > (b.unlockTime || 0) ? -1 : 1;
				});;

				const gameDetails = await getGameDetails(game.appid);

				const gameReview = await getGameReviews(game.appid);

				game.review = gameReview;

				Object.assign(game, gameDetails);

				// game.publisher = gameDetails.publisher;
				// game.developer = gameDetails.developer;
				// game.genres = gameDetails.genres;
				// game.price = gameDetails.price;
				// game.releaseDate = gameDetails.releaseDate;
				// game.metacritic = gameDetails.metacritic;
			}))

			games = games.map((game) => {
				const achievementsUnlocked = game.achievements.filter((achievement) => achievement.achieved).length;

				return {
					playtime: game.playtime_forever,
					icon: game.img_icon_url,
					_id: game.appid,
					name: game.name,
					lastPlayed: game.rtime_last_played,
					achievements: game.achievements || [],
					recentPlaytime: game.playtime_2weeks || 0,
					developer: game.developer,
					publisher: game.publisher,
					price: game.price,
					genres: game.genres,
					review: game.review,
					releaseDate: game.releaseDate,
					achievementsUnlocked: achievementsUnlocked,
					isPerfect: game.achievements.length ? game.achievements.length === achievementsUnlocked : false,
					completion: Math.floor(achievementsUnlocked / game.achievements.length * 100) || 0
				}
			})

			const user = await getUserInformation(steamId);

			let userSchema = await User.findOne({
				steamId: steamId
			})

			if (!userSchema) {
				userSchema = new Steam({
					user: user,
					games: games,
					lastProfileUpdate: Math.floor(Date.now() / 1000)
				})

				await userSchema.save();
			} else {
				await User.updateOne({
					steamId: steamId
				}, {
					user: user,
					games: games,
					lastProfileUpdate: Math.floor(Date.now() / 1000)
				});

				userSchema = await User.findOne({
					steamId: steamId
				})
			}

			res.status(200).json({ status: true, data: _clearResponse(userSchema) });
		} catch (error) {
			console.log(error);

			res.status(500).json({
				status: false,
				error: error.message || error
			})
		}
	})

async function getUserInformation(steamId) {
	try {
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
	} catch (error) {
		throw error;
	}
}

async function getUserGames(steamId, accessToken) {
	const baseUrl = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';

	const params = new URLSearchParams({
		steamid: steamId,
		include_appinfo: true,
		include_played_free_games: true
	})

	if (accessToken) {
		params.append('access_token', accessToken);
	} else {
		params.append('key', API_KEY);
	}

	const url = `${baseUrl}?${params.toString()}`;

	try {
		const response = await axios.get(url);
		return response.data.response.games || [];
	} catch (error) {
		throw error;
	}
}

async function getGameAchievements(appId, steamId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}`;

		const response = await axios.get(url);

		if (!response.data.game.availableGameStats) {
			return [];
		}

		const achievements = (response.data.game.availableGameStats.achievements || []).reduce((obj, item) => {
			obj[item.name] = item;
			return obj;
		}, {});

		const userAchievements = await getUserAchievementsForGame(appId, steamId) || []

		const percentageAchievements = await getAchievementPercentageForGame(appId);

		for (const _achievement of userAchievements) {
			achievements[_achievement.apiname].unlockTime = _achievement.unlocktime;

			achievements[_achievement.apiname].achieved = true;
		}

		for (const _achievement of percentageAchievements) {
			achievements[_achievement.name].rarity = _achievement.percent;
		}

		const regex = /\/([A-z0-9]*)\.jpg/

		return Object.values(achievements).map((achievement) => {
			return {
				appId: appId,
				icon: achievement.icon.match(regex)[1],
				iconGray: achievement.icongray.match(regex)[1],
				displayName: achievement.displayName,
				name: achievement.name,
				description: achievement.description,
				achieved: achievement.achieved ?? false,
				unlockTime: achievement.unlockTime,
				rarity: achievement.rarity,
			}
		});
	} catch (error) {
		throw error;
	}
}

async function getUserAchievementsForGame(appId, steamId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${steamId}&appid=${appId}`;

		const response = await fetch(url);
		const data = await response.json();
		return (data.playerstats.achievements || []).filter((achievement) => achievement.achieved);
	} catch (error) {
		throw error;
	}
}

async function getAchievementPercentageForGame(appId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?key=${API_KEY}&gameid=${appId}`;

		const response = await axios.get(url);
		return response.data.achievementpercentages.achievements || [];
	} catch (error) {
		throw error;
	}
}

async function getGameDetails(appId) {
	try {
		const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=US&l=en&filters=developers,publishers,price_overview,release_date,genres,metacritic`;

		const response = await axios.get(url);

		if (!response.data[appId].success) {
			return {};
		}

		let data = response.data[appId].data;

		data = {
			developer: data.developers[0],
			publisher: data.publishers[0],
			price: {
				currency: data.price_overview?.currency || 'USD',
				value: data.price_overview?.final ?? 0,
				formatted: data.price_overview?.final_formatted || '$0'
			},
			genres: (data.genres || []).map((genre) => genre.description),
			releaseDate: data.release_date.date,
			metacritic: data.metacritic
		}

		return data;
	} catch (error) {
		throw error;
	}
}

async function getGameReviews(appId) {
	try {
		const url = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&num_per_page=0&purchase_type=all`;

		const response = await axios.get(url);

		const data = {
			totalPositive: response.data.query_summary.total_positive,
			totalNegative: response.data.query_summary.total_negative,
			score: response.data.query_summary.review_score,
			rating: Number((response.data.query_summary.total_positive / (response.data.query_summary.total_positive + response.data.query_summary.total_negative) * 100).toFixed(2)) || 0
		}

		return data;
	} catch (error) {
		throw error;
	}
}

async function _checkTokenState(steamId) {
	try {
		const user = await User.findOne({
			steamId: steamId
		})

		if (!user) {
			throw `User not found: ${steamId}`;
		}

		const expTimestamp = jwt.decode(user.ACCESS_TOKEN).exp;

		if (expTimestamp < (Date.now() / 1000)) {
			const newAccessToken = await _refreshAccessToken(user.REFRESH_TOKEN, steamId);

			await User.updateOne({
				steamId: steamId
			}, {
				ACCESS_TOKEN: newAccessToken
			})

			return newAccessToken;
		}
	} catch (error) {
		throw error;
	}
}

async function _refreshAccessToken(refreshToken, steamId) {
	try {
		const url = 'https://api.steampowered.com/IAuthenticationService/GenerateAccessTokenForApp/v1';

		const response = await axios.post(url, null, {
			params: {
				key: API_KEY,
				refresh_token: refreshToken,
				steamid: steamId,
			},
		});

		return response.data.response.access_token;
	} catch (error) {
		throw error;
	}
}

async function getSteamId(username) {
	const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${API_KEY}&vanityurl=${username}`
	const response = await fetch(url);
	const data = await response.json();

	return data.response.steamid;

}

function _clearResponse(data) {
	const _data = JSON.parse(JSON.stringify(data));

	delete _data.ACCESS_TOKEN;
	delete _data.REFRESH_TOKEN;

	return _data;
}

export default router;