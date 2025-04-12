import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import hltb from 'howlongtobeat';

import User from './user.collection.js';
import Game from '../game/game.collection.js';

import * as UserUtils from './user.utils.js';

// TODO: Google Secrets Manager 

const hltbService = new hltb.HowLongToBeatService();
const router = express.Router()
const API_KEY = process.env.STEAM_API_KEY;

router.post('/fetch',
	async (req, res) => {
		try {
			const steamId = req.body.steamId;

			const profile = await User.findOne({
				"steamId": steamId
			})

			if (profile) {
				res.status(200).json({ status: true, data: _clearResponse(profile) });
				return;
			}

			if (req.body.profileOnly) {
				const user = await UserUtils.getUserInformation(steamId);

				await User.updateOne({
					steamId: steamId
				}, {
					user: user
				});

				res.sendResponse(200, user);

				return;
			}

			await _checkTokenState(steamId);

			const accessToken = (await User.findOne({
				steamId: steamId
			}))?.ACCESS_TOKEN || '';

			let games = await UserUtils.getUserGames(steamId, accessToken)

			games.sort((a, b) => {
				if (a.rtime_last_played < b.rtime_last_played) {
					return 1;
				}

				return -1;
			});

			await Promise.all(games.map(async (game) => {
				const gameAchievements = await UserUtils.getGameAchievements(game.appid, steamId);

				game.achievements = gameAchievements.sort((a, b) => {
					return (a.unlockTime || 0) > (b.unlockTime || 0) ? -1 : 1;
				});;

				const gameDetails = await UserUtils.getGameDetails(game.appid);

				const gameReview = await UserUtils.getGameReviews(game.appid);

				game.review = gameReview;

				Object.assign(game, gameDetails);
			}))

			const operations = games.map(game => ({
				updateOne: {
					filter: { _id: game._id },
					update: {
						$set: {
							...game,
							totalAchievements: game.achievements?.length || 0
						}
					},
					upsert: true
				}
			}));

			await Game.bulkWrite(operations);

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

			const user = await UserUtils.getUserInformation(steamId);

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
	}
)

router.get('/calculator/:steamId', async (req, res) => {
	const steamId = req.params.steamId;

	const t = UserUtils.test();

	res.sendResponse(200, t);
})

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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default router;