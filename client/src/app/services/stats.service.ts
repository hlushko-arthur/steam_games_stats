import { Injectable } from "@angular/core";
import { StatsAchievements, StatsChart, StatsGames, StatsPlaytime } from "../core/interfaces/stats.interface";
import { Achievement, Game } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class StatsService {
	achievements: StatsAchievements = {
		total: 0,
		gained: 0,
		toPerfection: 0,
		untouched: 0,
		dailyAverage: 0,
		dailyMax: 0
	};

	games: StatsGames = {
		owned: 0,
		perfect: 0,
		withAchievements: 0,
		inProgress: 0,
		started: 0,
		played: 0,
		untouched: 0,
		dailyMax: 0
	};

	playtime: StatsPlaytime = {
		total: 0,
		average: 0,
		median: 0,
		completions: 0
	}

	gamesChart: StatsChart = this._emptyGamesChart();

	achievementsChart: StatsChart = this._emptyAchievementsChart();

	rarestAchievements: Achievement[] = [];

	calculateStats(games: Game[]): void {
		this._calculateAchievements(games);

		this._calculateGames(games);

		this._calculatePlaytime(games);

		this._calculateGamesChart(games);

		this._calculateAchievementsChart(games);
	}

	private _calculateAchievements(games: Game[]): void {
		for (const game of games) {
			this.achievements.total += game.achievements.length;

			this.achievements.gained += game.achievementsUnlocked;

			if (games[0].playtime > 0 && game.achievementsUnlocked > 0) {
				this.achievements.toPerfection += game.achievements.length - game.achievementsUnlocked;
			}
		}

		this.achievements.untouched = this.achievements.total - this.achievements.gained - this.achievements.toPerfection;

		let achievements: Achievement[] = [];

		const grouped: Record<string, number> = {};

		for (const game of games) {
			achievements.push(...game.achievements.filter((a) => a.achieved));
			for (const achievement of game.achievements) {
				if (!achievement.achieved) {
					continue;
				}

				const date = new Date(achievement.unlockTime * 1000).toISOString().split('T')[0];

				if (!grouped[date]) {
					grouped[date] = 0;
				}

				grouped[date]++;
			}
		}

		achievements = achievements.sort((a, b) => {
			return a.rarity > b.rarity ? 1 : -1;
		})

		this.rarestAchievements = achievements.slice(0, 20);

		console.log(this.rarestAchievements);


		this.achievements.dailyAverage = Number((Object.values(grouped).reduce((total, value) => total += value, 0) / Object.keys(grouped).length).toFixed(2));

		this.achievements.dailyMax = Math.max(...Object.values(grouped));
	}

	private _calculateGames(games: Game[]): void {
		this.games.owned = games.length;

		for (const game of games) {
			this.games.perfect += game.isPerfect ? 1 : 0;

			this.games.withAchievements += game.achievements.length ? 1 : 0;

			this.games.played += game.playtime ? 1 : 0;

			if (game.achievementsUnlocked === 0 && game.achievements.length) {
				this.games.untouched++;
			}

			if (game.achievementsUnlocked > 0 && game.achievementsUnlocked < game.achievements.length) {
				this.games.started++;
			}

			if (game.achievements.length > game.achievementsUnlocked && game.playtime) {
				this.games.inProgress++;
			}
		}
	}

	private _calculatePlaytime(games: Game[]): void {
		for (const game of games) {
			this.playtime.total += game.playtime;

			this.playtime.completions += game.isPerfect ? game.playtime : 0;
		}

		const _games = games.filter((game) => game.playtime && game.achievementsUnlocked > 0);

		const playtime = _games.reduce((total, game) => total += game.playtime, 0);

		this.playtime.average = playtime / _games.length;
	}

	private _calculateGamesChart(games: Game[]): void {
		const keys = Object.keys(this.gamesChart);

		for (const game of games) {
			if (!game.achievements.length || !game.playtime || !game.achievementsUnlocked) {
				continue;
			}

			const completionValue = game.achievementsUnlocked / game.achievements.length * 100;

			for (const key of keys) {
				const from = Number(key.split('-')[0]);
				const to = Number(key.split('-')[1]);

				if (completionValue === 100) {
					this.gamesChart[100].value++;
					break;
				} else if (completionValue >= from && completionValue < to) {
					this.gamesChart[key].value++;
					break;
				}
			}
		}

		const max = Math.max(...Object.values(this.gamesChart).map((a) => a.value));

		for (const value of Object.values(this.gamesChart)) {
			value.height = Number((value.value / max * 300).toFixed(2));
		}
	}

	private _calculateAchievementsChart(games: Game[]): void {
		const keys = Object.keys(this.achievementsChart);

		for (const game of games) {
			for (const achievement of game.achievements) {
				if (!achievement.achieved) {
					continue;
				}

				for (const key of keys) {
					const from = Number(key.split('-')[1]);
					const to = Number(key.split('-')[0]);

					if (achievement.rarity >= from && achievement.rarity < to) {
						this.achievementsChart[key].value++;
					}

				}
			}
		}

		const max = Math.max(...Object.values(this.achievementsChart).map((a) => a.value));

		for (const value of Object.values(this.achievementsChart)) {
			value.height = Number((value.value / max * 300).toFixed(2));
		}
	}

	private _emptyAchievementsChart(): StatsChart {
		return {
			'100-75': {
				value: 0,
				height: 0
			},
			'75-50': {
				value: 0,
				height: 0
			},
			'50-25': {
				value: 0,
				height: 0
			},
			'25-10': {
				value: 0,
				height: 0
			},
			'10-5': {
				value: 0,
				height: 0
			},
			'5-3': {
				value: 0,
				height: 0
			},
			'3-1': {
				value: 0,
				height: 0
			},
			'1-0.5': {
				value: 0,
				height: 0
			},
			'0.5-0.2': {
				value: 0,
				height: 0
			},
			'0.2-0.1': {
				value: 0,
				height: 0
			},
			'0.1-0': {
				value: 0,
				height: 0
			},
		}
	}

	private _emptyGamesChart(): StatsChart {
		return {
			'0-10': {
				value: 0,
				height: 0
			},
			'10-20': {
				value: 0,
				height: 0
			},
			'20-30': {
				value: 0,
				height: 0
			},
			'30-40': {
				value: 0,
				height: 0
			},
			'40-50': {
				value: 0,
				height: 0
			},
			'50-60': {
				value: 0,
				height: 0
			},
			'60-70': {
				value: 0,
				height: 0
			},
			'70-80': {
				value: 0,
				height: 0
			},
			'80-90': {
				value: 0,
				height: 0
			},
			'90-99': {
				value: 0,
				height: 0
			},
			'100': {
				value: 0,
				height: 0
			}
		}
	}
}