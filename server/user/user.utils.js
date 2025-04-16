import axios from 'axios';
import jwt from 'jsonwebtoken';

import User from './user.collection.js';
import Game from '../game/game.collection.js';

const API_KEY = process.env.STEAM_API_KEY;

export async function fetchSteamProfile(steamId) {
	await checkTokenState(steamId);

	const profile = await User.findOne({ steamId });

	let games = await getUserGames(steamId, profile.ACCESS_TOKEN)

	games.sort((a, b) => b.rtime_last_played - a.rtime_last_played);

	games = games.map((game) => {
		return {
			playtime: game.playtime_forever,
			icon: game.img_icon_url,
			_id: game.appid,
			name: game.name,
			lastPlayed: game.rtime_last_played,
			achievements: game.achievements || [],
			recentPlaytime: game.playtime_2weeks || 0,
		}
	})

	const storedGameIds = [];

	await Promise.all(games.map(async (game) => {
		const storedGame = await Game.findOne({
			_id: game._id
		})

		if (!storedGame) {
			game.achievements = await getGameAchievements(game._id, steamId);

			const gameDetails = await getGameDetails(game._id);

			game.review = await getGameReviews(game._id);

			Object.assign(game, gameDetails);

			await Game.create(game);
		} else {
			storedGameIds.push(game._id);

			Object.assign(game, storedGame.toObject());
		}

		await setUserAchievementsForGame(game.achievements, game._id, steamId);


	}));

	if (storedGameIds.length) {
		const appIds = storedGameIds.join(',');

		const prices = await getGamesPrice(appIds);

		const operations = [];

		for (const game of games) {
			const newGamePrice = prices[game._id];

			if (!newGamePrice) {
				continue;
			}

			game.price = newGamePrice;

			operations.push({
				updateOne: {
					filter: { _id: game._id },
					update: {
						$set: {
							price: game.price
						}
					}
				}
			})
		}

		await Game.bulkWrite(operations);
	}

	games = games.map((game) => {
		const achievementsUnlocked = game.achievements.filter((achievement) => achievement.achieved).length

		return {
			...game,
			achievementsUnlocked: achievementsUnlocked,
			isPerfect: game.achievements.length ? game.achievements.length === achievementsUnlocked : false,
			completion: Math.floor(achievementsUnlocked / game.achievements.length * 100) || 0
		}
	})

	const user = await getUserInformation(steamId);

	await User.updateOne({
		steamId: steamId
	}, {
		games: games,
		user: user
	}, {
		upsert: true,
		setDefaultsOnInsert: true
	})

	return {
		steamId: user.steamId,
		games,
		user
	}
}

export async function getUserInformation(steamId) {
	const user = await getPlayerSummaries(steamId);

	await sleep(500);

	const avatar = await getPlayerAvatar(steamId);

	await sleep(500);

	const { totalXP, badges } = await getPlayerBadges(steamId);

	const level = await getPlayerLevel(totalXP);

	await sleep(500);

	const bans = await getPlayerBans(steamId);

	await sleep(500)

	const background = await getProfileBackground(steamId);

	await sleep(500);

	const miniBackground = await getMiniProfileBackground(steamId);

	await sleep(500);

	const avatarFrame = await getAvatarFrame(steamId);

	return {
		...user,
		avatar,
		badges,
		bans,
		level,
		background,
		miniBackground,
		avatarFrame
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

		if (!response.data.game.availableGameStats?.achievements) {
			return [];
		}

		const achievements = response.data.game.availableGameStats.achievements;

		const achievementsRarity = await getAchievementsRarityForGame(appId);

		return achievements.map((achievement) => {
			return {
				icon: achievement.icon.match(/\/([A-z0-9]*\.jpg)/)[1],
				iconGray: achievement.icongray.match(/\/([A-z0-9]*\.jpg)/)[1],
				displayName: achievement.displayName,
				apiName: achievement.name,
				description: achievement.description,
				rarity: achievementsRarity[achievement.name],
			}
		})
	} catch (error) {
		throw error;
	}
}

async function setUserAchievementsForGame(achievements, appId, steamId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${steamId}&appid=${appId}`;

		const response = await fetch(url);
		const data = await response.json();

		if (!data.playerstats.achievements) {
			return [];
		}

		const userAchievements = data.playerstats.achievements.reduce((obj, achievement) => {
			obj[achievement.apiname] = achievement;
			return obj;
		}, {});

		for (const achievement of achievements) {
			achievement.achieved = userAchievements[achievement.apiName].achieved;
			achievement.unlockTime = userAchievements[achievement.apiName].unlocktime;
		};

		return achievements;
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
				currency: value.data.price_overview?.currency || 'USD',
				initial: value.data.price_overview?.initial ?? 0,
				initialFormatted: value.data.price_overview?.initial_formatted || '$0',
				final: value.data.price_overview?.final ?? 0,
				finalFormatted: value.data.price_overview?.final_formatted || '$0'
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

async function getGamesPrice(appIds) {
	try {
		const url = `https://store.steampowered.com/api/appdetails?appids=${appIds}&cc=US&l=en&filters=price_overview`;

		const response = await axios.get(url);

		const prices = response.data;

		for (const [key, value] of Object.entries(prices)) {
			if (!value.success) {
				delete prices[key];
				continue;
			}

			prices[key] = {
				currency: value.data.price_overview?.currency || 'USD',
				initial: value.data.price_overview?.initial ?? 0,
				initialFormatted: value.data.price_overview?.initial_formatted || '$0',
				final: value.data.price_overview?.final ?? 0,
				finalFormatted: value.data.price_overview?.final_formatted || '$0'
			}
		}

		return prices;
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
};

async function getPlayerSummaries(steamId) {
	try {
		const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const user = data.response.players[0];

		return {
			name: user.personaname,
			timeCreated: user.timecreated,
			steamId: user.steamid,
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerBadges(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const badges = data.response.badges;

		const totalXP = badges.reduce((total, { xp }) => total += xp, 0);

		return {
			totalXP,
			badges
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerBans(steamId) {
	try {
		const url = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${API_KEY}&steamids=${steamId}`;

		const response = await fetch(url);
		const data = (await response.json()).players[0];


		return {
			VAC: data.VACBanned,
			game: Boolean(data.NumberOfGameBans),
			community: data.CommunityBanned,
			economy: data.EconomyBan !== 'none'
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerAvatar(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetAnimatedAvatar/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const avatarData = data.response.avatar;

		return {
			title: avatarData.item_title,
			appId: avatarData.appid,
			type: avatarData.item_type,
			class: avatarData.item_class,
			icon: avatarData.image_large.match(/\/([0-9]*\/[0-9A-z]*\.jpg)/)[1],
			iconAnimated: avatarData.image_small.match(/\/([0-9]*\/[0-9A-z]*\.gif)/)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getAvatarFrame(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetAvatarFrame/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const frame = data.response.avatar_frame;

		return {
			title: frame.item_title,
			appId: frame.appid,
			type: frame.item_type,
			class: frame.item_class,
			icon: frame.image_large.match(/\/([0-9]*\/[0-9A-z]*\.png)/)[1],
			iconAnimated: frame.image_small.match(/\/([0-9]*\/[0-9A-z]*\.png)/)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getProfileBackground(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const background = data.response.profile_background;

		return {
			title: background.item_title,
			appId: background.appid,
			type: background.item_type,
			class: background.item_class,
			icon: background.image_large.match(/\/([0-9]*\/[0-9A-z]*\.jpg)/)[1],
			iconAnimated: background.movie_webm.match(/\/([0-9]*\/[0-9A-z]*\.webm)/)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getMiniProfileBackground(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetMiniProfileBackground/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const background = data.response.profile_background;

		return {
			title: background.item_title,
			appId: background.appid,
			type: background.item_type,
			class: background.item_class,
			icon: background.image_large.match(/\/([0-9]*\/[0-9A-z]*\.jpg)/)[1],
			iconAnimated: background.movie_webm.match(/\/([0-9]*\/[0-9A-z]*\.webm)/)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerLevel(totalXP) {
	try {
		let remainingXP = totalXP;
		let level = 0;

		while (true) {
			const multiplier = level < 10 ? 1 : Math.floor(level / 10) + 1;

			const requiredXP = multiplier * 100;

			if (remainingXP < requiredXP) {
				return {
					currentXP: remainingXP,
					totalXP: totalXP,
					nextLevelXP: requiredXP,
					value: level,
				};
			}

			remainingXP -= requiredXP;

			level++;
		}
	} catch (error) {
		throw error;
	}
}

async function getAchievementsRarityForGame(appId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?key=${API_KEY}&gameid=${appId}`;

		const response = await axios.get(url);
		return (response.data.achievementpercentages.achievements || []).reduce((obj, achievement) => {
			obj[achievement.name] = Number(achievement.percent);
			return obj;
		}, {});

	} catch (error) {
		throw error;
	}
}

async function checkTokenState(steamId) {
	try {
		const user = await User.findOne({
			steamId: steamId
		})

		if (!user || !('ACCESS_TOKEN' in user)) {
			return;
		}

		console.log(user.ACCESS_TOKEN);


		console.log(jwt.decode(user.ACCESS_TOKEN));


		const expTimestamp = jwt.decode(user.ACCESS_TOKEN).exp;

		if (expTimestamp < (Date.now() / 1000)) {
			const newAccessToken = await refreshAccessToken(user.REFRESH_TOKEN, steamId);

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

async function refreshAccessToken(refreshToken, steamId) {
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));