import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	lastProfileUpdate: Number,
	steamId: String,
	ACCESS_TOKEN: String,
	REFRESH_TOKEN: String,
	user: {
		name: String,
		timeCreated: Number,
		steamId: String,
		avatar: {
			title: String,
			appId: Number,
			type: { type: Number },
			class: Number,
			icon: String,
			iconAnimated: String
		},
		background: {
			title: String,
			appId: Number,
			type: { type: Number },
			class: Number,
			icon: String,
			iconAnimated: String,
		},
		miniBackground: {
			title: String,
			appId: Number,
			type: { type: Number },
			class: Number,
			icon: String,
			iconAnimated: String,
		},
		avatarFrame: {
			title: String,
			appId: Number,
			type: { type: Number },
			class: Number,
			icon: String,
			iconAnimated: String,
		},
		badges: [{
			_id: Number,
			level: Number,
			xp: Number,
			appId: Number,
			isFoil: Boolean
		}],
		level: {
			currentXP: Number,
			totalXP: Number,
			nextLevelXP: Number,
			value: Number,
		},
		bans: {
			VAC: Boolean,
			game: Boolean,
			community: Boolean,
			economy: Boolean

		}
	},
	games: [{
		achievements: [{
			appId: Number,
			displayName: String,
			icon: String,
			iconGray: String,
			name: String,
			description: String,
			unlockTime: Number,
			achieved: Boolean,
			rarity: Number
		}],
		achievementsUnlocked: Number,
		completion: Number,
		isPerfect: Boolean,
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
		}
	}]

})

const User = mongoose.model('User', userSchema);

export default User;