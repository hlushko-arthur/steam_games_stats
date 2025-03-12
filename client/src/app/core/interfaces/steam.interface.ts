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
	}
}

export interface User {
	avatar: string;
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