import { Injectable } from "@angular/core";
import { Game, User } from "../core/interfaces/steam.interface";
import { HttpService } from "./http.service";
import { Response } from "../core/interfaces/api.interface";

@Injectable({
	providedIn: 'root'
})

export class GameService {
	games: Record<number, Game> = {};

	constructor(private _http: HttpService) {}

	setGames(games: Game[]): void {
		games = structuredClone(games);

		for (const game of games) {
			this.games[game._id] = game;
		}
	}

	game(appId: number): Game {
		return this.games[appId];
	}

	async fetch(appId: number, steamId: string): Promise<Game> {
		const response = await this._http.post<Game>('/game/fetch', {
			appId: appId,
			steamId: steamId
		});

		return response.data;
	}

	async getPlayersStats(appId: number): Promise<User[]> {
		const response = await this._http.post<User[]>('/game/get_players_stats', {
			appId: appId
		});

		return response.data;
	}
}