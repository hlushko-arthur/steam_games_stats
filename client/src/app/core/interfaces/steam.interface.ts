export interface Achievement {
	displayName: string;
	icon: string;
	icongray: string;
	name: string;
}

export interface UserAchievement {
	name: string;
	unlockTime: number;
}

export interface Game {
	achievements: Achievement[];
	_id: number;
	icon: string;
	name: string;
	playtime: number;
	lastDatePlayed: number;
	userAchievements: UserAchievement[];
}

export interface User {
	avatar: string;
	name: string;
	steamId: string;
	timeCreated: number;
}

export interface UserProfile {
	user: User;
	games: Game[]
}