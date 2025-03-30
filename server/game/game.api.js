import express from 'express';
import User from '../user/user.collection.js';

const router = express.Router()

router.post('/fetch', async (req, res) => {
	const user = await User.findOne({
		steamId: req.body.steamId
	})

	if (!user) {
		sendError(res, 404, 'User not found');

		return;
	}

	const game = user.games.find((game) => game._id === req.body.appId);

	if (!game) {
		sendError(res, 404, 'Game not found');

		return;
	}

	res.status(200).json({
		status: true,
		data: game
	})
})

router.post('/get_players_stats', async (req, res) => {
	try {
		const users = await User.find({
			'games._id': req.body.appId
		})

		const response = [];

		for (const user of users) {
			const game = user.games.find((game) => game._id === req.body.appId);

			response.push({
				steamId: user.steamId,
				name: user.user.name,
				avatarUrl: user.user.avatar,
				achievementsUnlocked: game.achievementsUnlocked,
				completion: game.completion,
				playtime: game.playtime
			})
		}

		res.status(200).json({
			status: true,
			data: response
		})
	} catch (error) {
		res.status(500).json({
			status: false,
			error: error.message || error
		})
	}
})

function sendError(res, statusCode, message) {
	res.status(statusCode).json({
		status: false,
		message: message
	})
}

export default router;