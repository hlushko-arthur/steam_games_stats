export interface StatsAchievements {
	total: number;
	gained: number;
	untouched: number;
	toPerfection: number;
	dailyMax: number;
	dailyAverage: number;
}

export interface StatsGames {
	owned: number;
	perfect: number;
	withAchievements: number;
	inProgress: number;
	started: number;
	played: number;
	untouched: number;
	dailyMax: number;
}

export interface StatsPlaytime {
	total: number;
	average: number;
	median: number;
	completions: number;
}

// export type StatsChart = Record<string, {
// 	value: number, height: number
// }>

export interface StatsChart {
	[key: string]: {
		value: number;
		height: number;
	}
}