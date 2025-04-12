interface BaseAchievement {
	displayName: string;
	icon: string;
	icongray: string;
	name: string;
	rarity: number;
	appId: number;
	achieved: boolean;
	unlockTime?: number;
}

export type Achievement = BaseAchievement & ({
	achieved: true;
	unlockTime: number;
} | {
	achieved: false;
})

// export type Achievement = BaseAchievement & {
// 	achieved: boolean;
// 	unlockTime?: number;
// }
 
export interface Game {
	achievements: Achievement[];
	_id: number;
	icon: string;
	name: string;
	playtime: number;
	lastPlayed: number;
	recentPlaytime: number;
	achievementsUnlocked: number;
	isPerfect?: boolean;
	releaseDate: string;
	genres: string[];
	completion: number;
	price: {
		currency: string;
		value: number;
		formatted: string;
	},
	developer: string;
	publisher: string;
	review: {
		totalPositive: number;
		totalNegative: number;
		score: number;
		rating: number;
	},
	metacritic?: {
		score: number;
		url: string;
	}
}

interface customizationItem {
	title: string;
	type: number;
	class: number;
	appId: number;
	icon: string;
	iconAnimated: string;
}

export interface User {
	avatar: customizationItem;
	avatarFrame: customizationItem;
	background: customizationItem;
	miniBackground: customizationItem;
	badges: {
		special: number,
		default: number,
		foil: number,
		levels: {
			'1': number,
			'2': number,
			'3': number,
			'4': number,
			'5': number,
			'6+': number
		},
		items: [{
			_id: number,
			level: number,
			xp: number,
			appId: number,
			isFoil: boolean
		}]
	},
	bans: {
		VAC: boolean;
		game: boolean;
		economy: boolean;
		community: boolean;
	},
	level: {
		currentXP: number,
		totalXP: number,
		nextLevelXP: number,
		value: number,
	},
	name: string;
	steamId: string;
	timeCreated: number;
}

export interface UserProfile {
	user: User;
	games: Game[];
	steamId: string;
	lastDateUpdated: number;
}