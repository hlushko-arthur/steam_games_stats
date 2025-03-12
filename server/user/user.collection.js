import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	lastProfileUpdate: Number,
	steamId: String,
	ACCESS_TOKEN: String,
	REFRESH_TOKEN: String,
	user: {
		name: String,
		avatar: String,
		timeCreated: Number,
		steamId: String,
	},
	games: [{
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
		}
	}]

})

const User = mongoose.model('User', userSchema);

export default User;