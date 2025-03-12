import { Injectable, signal } from "@angular/core";
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

		console.log(user);


		if(user) {
			this.user = user;
		}
	}

	async fetchProfile(steamId: string): Promise<UserProfile> {
		const userData = await this._http.get<UserProfile>(`/steam/fetch_profile?steamID=${steamId}`);

		this._configureProfile(userData.games);

		this.userData = userData;

		this._store.setJson('user', userData.user);

		this.user = userData.user;

		return userData;
	}

	private _configureProfile(games: Game[]): void {
		for (const game of games) {
			game.achievementsUnlocked = game.achievements.filter((achievement) => achievement.achieved).length;

			if (game.achievements.length) {
				game.isPerfect = game.achievements.length === game.achievementsUnlocked;
			}
		}

		this._sortGames(games);
	}

	private _sortGames(games: Game[]): void {
		games = games.sort((a, b) => {
			if (a.lastPlayed < b.lastPlayed) {
				return 1;
			}

			return -1;
		})
	}
}