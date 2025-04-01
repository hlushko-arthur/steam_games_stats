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

	game(appId: number): Game {
		return this.games[appId];
	}

	async fetch(appId: number, steamId: string): Promise<Game | null> {
		const response = await this._http.post<Game>('/game/fetch', {
			appId: appId,
			steamId: steamId
		});

		if (!response.status) {
			return null;
		}

		return response.data;
	}

	async getPlayersStats(appId: number): Promise<User[] | null> {
		const response = await this._http.post<User[]>('/game/get_players_stats', {
			appId: appId
		});

		if (!response.status) {
			return null;
		}

		return response.data;
	}
}