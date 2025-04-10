import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
	totalAchievements: Number,
	_id: Number,
	icon: String,
	name: String,
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
	},
	createdAt: Number 
})


const Game = mongoose.model('Game', gameSchema);

export default Game;
