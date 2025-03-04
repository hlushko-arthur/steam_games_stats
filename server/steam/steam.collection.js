import mongoose from 'mongoose';

const steamSchema = new mongoose.Schema({
	user: {
		name: String,
		avatar: String,
		timeCreated: Number,
		steamId: String,
	},
	games: [{
		achievements: [{
			displayName: String,
			icon: String,
			iconGray: String,
			name: String,
			description: String
		}],
		userAchievements: [{
			name: String,
			unlockTime: String
		}],
		_id: Number,
		icon: String,
		name: String,
		playtime: Number,
		lastDatePlayed: Number,
	}]
})

const Steam = mongoose.model('Steam', steamSchema);

export default Steam;