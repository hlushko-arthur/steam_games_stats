import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import hltb from 'howlongtobeat';

import User from './user.collection.js';
import Game from '../game/game.collection.js';

import * as UserUtils from './user.utils.js';
import * as UserCalc from './user.calculation.js';

// TODO: Google Secrets Manager 

// const hltbService = new hltb.HowLongToBeatService();
const router = express.Router()
const API_KEY = process.env.STEAM_API_KEY;

// hltbService.search('A Little To The').then(result => console.log(result));

router.post('/fetch',
	async (req, res) => {
		try {
			const { steamId, profileOnly } = req.body;

			if (!steamId) {
				return res.sendError(400, 'Missing steamId');
			}

			const existingUser = await User.findOne({ steamId });

			if (existingUser && !profileOnly) {
				return res.status(200).json({ status: true, data: _clearResponse(existingUser) });
			}

			if (profileOnly) {
				const user = await UserUtils.getUserInformation(steamId);

				await User.updateOne({
					steamId: steamId
				}, {
					user: user
				}, {
					upsert: true
				});

				res.sendResponse(200, user);

				return;
			}

			const profile = await UserUtils.fetchSteamProfile(steamId);

			res.sendResponse(200, profile);
		} catch (error) {
			console.log(error);

			res.sendError(500, error.message || error);
		}
	}
)

router.get('/calculator/:steamId', async (req, res) => {
	const steamId = req.params.steamId;

	// const profile = await UserUtils.fetchSteamProfile(steamId);

	const profile = await User.findOne({ steamId });

	const stats = UserCalc.getUserStats(profile);

	res.sendResponse(200, stats);
})

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