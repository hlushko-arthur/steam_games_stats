import express from 'express';
import User from '../user/user.collection.js';

const router = express.Router()

router.post('/fetch', async (req, res) => {
	const user = await User.findOne({
		steamId: req.body.steamId
	})

	if (!user) {
		res.sendError(404, 'User not found');

		return;
	}

	const game = user.games.find((game) => game._id === req.body.appId);

	if (!game) {
		res.sendError(404, 'Game not found');

		return;
	}

	res.sendResponse(200, game);
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

		res.sendResponse(200, response);
	} catch (error) {
		res.sendError(500, error.message || error)
	}
})

export default router;