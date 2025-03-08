import { Injectable } from "@angular/core";
import { StatsAchievements, StatsGames, StatsPlaytime } from "../core/interfaces/stats.interface";
import { Game } from "../core/interfaces/steam.interface";

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

	calculateStats(games: Game[]): void {
		this._calculateAchievements(games);

		this._calculateGames(games);

		this._calculatePlaytime(games);

		console.log(this.achievements);
		console.log(this.games);
		console.log(this.playtime);



	}

	private _calculateAchievements(games: Game[]): void {
		for (const game of games) {
			this.achievements.total += game.achievements.length;

			this.achievements.gained += game.userAchievements.length;

			if (games[0].playtime > 0 && game.userAchievements.length > 0) {
				this.achievements.toPerfection += game.achievements.length - game.userAchievements.length;
			}
		}

		this.achievements.untouched = this.achievements.total - this.achievements.gained - this.achievements.toPerfection;

		const grouped: Record<string, number> = {};

		for (const game of games) {
			for (const achievement of game.userAchievements) {
				const date = new Date(achievement.unlockTime * 1000).toISOString().split('T')[0];

				if (!grouped[date]) {
					grouped[date] = 0;
				}

				grouped[date]++;
			}
		}

		this.achievements.dailyAverage = Number((Object.values(grouped).reduce((total, value) => total += value, 0) / Object.keys(grouped).length).toFixed(2));

		this.achievements.dailyMax = Math.max(...Object.values(grouped));
	}

	private _calculateGames(games: Game[]): void {
		this.games.owned = games.length;

		for (const game of games) {
			this.games.perfect += game.isPerfect ? 1 : 0;

			this.games.withAchievements += game.achievements.length ? 1 : 0;

			this.games.played += game.playtime ? 1 : 0;

			if (game.userAchievements.length === 0 && game.achievements.length) {
				this.games.untouched++;
			}

			if (game.userAchievements.length > 0 && game.userAchievements.length < game.achievements.length) {
				this.games.started++;
			}

			if (game.achievements.length > game.userAchievements.length && game.playtime) {
				this.games.inProgress++;
			}
		}
	}

	private _calculatePlaytime(games: Game[]): void {
		for (const game of games) {
			this.playtime.total += game.playtime;

			this.playtime.completions += game.isPerfect ? game.playtime : 0;
		}

		const _games = games.filter((game) => game.playtime && game.userAchievements.length > 0);

		const playtime = _games.reduce((total, game) => total += game.playtime, 0);

		this.playtime.average = playtime / _games.length;
	}
}