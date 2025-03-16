import { Injectable } from "@angular/core";
import { Game } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class GameService {
	games: Record<number, Game> = {};

	setGames(games: Game[]): void {
		games = structuredClone(games);

		for (const game of games) {
			this.games[game._id] = game;
		}
	}

	game(appId: number): Game {
		return this.games[appId];
	}
}