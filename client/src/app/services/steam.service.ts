import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { UserProfile } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class SteamService {
	constructor(private _http: HttpService) { }

	async fetchUserData(steamId: string): Promise<UserProfile> {
		const userData = await this._http.get<UserProfile>(`/steam/get_user_data?steamID=${steamId}`);

		userData.games.forEach((game) => {
			if (game.achievements.length && game.userAchievements.length === game.achievements.length) {
				game.isPerfect = true;
			}
		})

		return userData;
	}
}