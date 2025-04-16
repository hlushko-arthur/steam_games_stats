interface UserLevel {
	currentXP: number;
	nextLevelXP: number;
	totalXP: number;
	value: number;
}

interface CustomizationItem {
	icon: string;
	iconAnimated: string;
}

export interface User {

}

export interface UserCalculation {
	name: string;
	timeCreated: number;
	steamId: string;
	totalGamesCount: number;
	playedGamesCount: number;
	playedGamesPercent: number;
	level: UserLevel;
	avatar: CustomizationItem;
	avatarFrame: CustomizationItem;
	background: CustomizationItem;
	averageGamesPrice: string;
	totalGamesPrice: string;
	todayGamesPrice: string;
	averagePlaytime: number;
	totalPlaytime: number;
	pricePerHour: string;
	badges: {title: string; value: number | string}[];
	bans: {title: string; value: number | string}[];
	customization: {title: string; value: number | string}[];
	gamesByCost: {title: string; value: number | string}[];
	gamesByPlaytime: {title: string; value: number | string}[];
}