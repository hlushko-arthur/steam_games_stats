import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Game, UserProfile } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class UserService {
	constructor(private _http: HttpService) { }

	async fetchProfile(steamId: string): Promise<UserProfile> {
		const userData = await this._http.get<UserProfile>(`/steam/fetch_profile?steamID=${steamId}`);

		this._configurateProfile(userData.games);

		return userData;
	}

	private _configurateProfile(games: Game[]): void {
		for (const game of games) {
			game.achievementsUnlocked = game.achievements.filter((achievement) => achievement.achieved).length;

			if (game.achievements.length) {
				game.isPerfect = game.achievements.length === game.achievementsUnlocked;
			}
		}
	}
}