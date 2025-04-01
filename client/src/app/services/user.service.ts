import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User, UserProfile } from "../core/interfaces/steam.interface";
import { StoreService } from "./store.service";
import { UserServiceAPI } from "../core/interfaces/api.interface";

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

	async fetch(payload: UserServiceAPI.FETCH.Payload): Promise<UserProfile | null> {
		const response = await this._http.post<UserProfile>(`/user/fetch`, payload);

		if (!response.status) {
			return null;
		}

		return response.data;
	}
}