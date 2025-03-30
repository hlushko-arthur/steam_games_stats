import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Game, User, UserProfile } from "../core/interfaces/steam.interface";
import { StoreService } from "./store.service";

@Injectable({
	providedIn: 'root'
})

export class UserService {
	userData: UserProfile = {} as UserProfile;

	user: User = {} as User;

	constructor(private _http: HttpService, private _store: StoreService) {
		const user = this._store.getJson<User>('user');

		if (user) {
			this.user = user;
		}
	}

	async fetchProfile(steamId: string): Promise<UserProfile> {
		const response = await this._http.get<UserProfile>(`/user/fetch_profile?steamID=${steamId}`);

		this._configureProfile(response.data.games);

		this.userData = response.data;

		this.user = this.userData.user;

		return this.userData;
	}

	private _configureProfile(games: Game[]): void {
		for (const game of games) {
			if (game.achievements.length) {
				game.isPerfect = game.achievements.length === game.achievementsUnlocked;
			}
		}
	}
}