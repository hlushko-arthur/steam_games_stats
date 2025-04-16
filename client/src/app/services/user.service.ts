import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User, UserProfile } from "../core/interfaces/steam.interface";
import { StoreService } from "./store.service";
import { UserServiceAPI } from "../core/interfaces/api.interface";
import { UserCalculation } from "../core/interfaces/user.interface";

@Injectable({
	providedIn: 'root'
})

export class UserService {
	userData: UserProfile = {} as UserProfile;

	user: User = {} as User;

	constructor(private _http: HttpService, private _store: StoreService) {
		const user = this._store.getJson<User>('user');

		console.log(user);
		

		if (user) {
			this.user = user;
		}
	}

	async fetch(payload: UserServiceAPI.FETCH.Payload): Promise<UserProfile | null> {
		const response = await this._http.post<UserProfile>(`/user/fetch`, payload);

		if (!response.status) {
			return null;
		}

		return response.data;
	}

	async getCalculation(steamId: string): Promise<UserCalculation | null> {
		const response = await this._http.get<UserCalculation>(`/user/calculator/${steamId}`);

		if (!response.status) {
			return null;
		}

		return response.data;
	}
}