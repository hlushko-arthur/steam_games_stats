import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { UserProfile } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class SteamService {
	constructor(private _http: HttpService) { }

	async fetchProfile(steamId: string): Promise<UserProfile> {
		const userData = await this._http.get<UserProfile>(`/steam/get_user_data?steamID=${steamId}`);

		return userData;
	}
}