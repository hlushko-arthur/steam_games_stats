import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
	_id: Number,
	icon: String,
	name: String,
	developer: String,
	publisher: String,
	releaseDate: String,
	updatedAt: Number,
	price: {
		currency: String,
		initial: Number,
		initialFormatted: String,
		final: Number,
		finalFormatted: String,
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
	achievements: [{
		displayName: String,
		apiName: String,
		icon: String,
		iconGray: String,
		description: String,
		rarity: Number
	}]
}, {
	versionKey: false
})


const Game = mongoose.model('Game', gameSchema);

export default Game;
