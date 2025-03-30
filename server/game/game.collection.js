import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
	achievements: [{
		appId: Number,
		displayName: String,
		icon: String,
		iconGray: String,
		name: String,
		description: String,
		unlockTime: String,
		achieved: Boolean,
		rarity: Number
	}],
	_id: Number,
	icon: String,
	name: String,
	playtime: Number,
	lastPlayed: Number,
	recentPlaytime: Number,
	developer: String,
	publisher: String,
	releaseDate: String,
	price: {
		currency: String,
		value: Number,
		formatted: String,
	},
	genres: [String],
	review: {
		totalPositive: Number,
		totalNegative: Number,
		score: Number,
		rating: Number
	},
	metacritic: {
		score: Number,
		url: String
	}
})

export const GameSchema = gameSchema;

const Game = mongoose.model('Game', gameSchema);

export default Game;
