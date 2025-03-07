import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { UserProfile } from "../core/interfaces/steam.interface";

@Injectable({
	providedIn: 'root'
})

export class SteamService {
	constructor(private _http: HttpService) { }

	async fetchUserData(steamId: string): Promise<UserProfile> {
		return await this._http.get(`api/steam/get_user_data?steamID=${steamId}`);
	}
}