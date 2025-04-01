import { Injectable, signal } from "@angular/core";
import { HttpService } from "./http.service";
import { SocketService } from "./socket.service";
import { UserService } from "./user.service";
import { StoreService } from "./store.service";
import { Router } from "@angular/router";
@Injectable({
	providedIn: 'root'
})

export class SteamAuthService {
	qrUrl = signal('');

	constructor(private _http: HttpService, private _socket: SocketService, private _user: UserService, private _store: StoreService, private _router: Router) {
		this._socket.on('qrCode', (url: string) => {
			this.qrUrl.set(url);
		});

		this._socket.on('authenticated', async (steamId: string) => {
			const profile = await this._user.fetch({
				steamId,
				profileOnly: true
			});

			if (!profile) {
				return;
			}

			this._store.setJson('user', profile.user);

			this._user.user = profile.user;

			this._router.navigateByUrl(`/profile/${profile.user.steamId}`);
		});
	}

	async startQRAuth(): Promise<string> {
		const response = await this._http.get<string>('/user/auth/qr');

		if (!response.status) {
			return '';
		}

		return response.data;
	}

	async login(accountName: string, password: string): Promise<string[]> {
		const response = await this._http.post<string[]>('/user/auth/login', {
			accountName,
			password
		});

		if (!response.status) {
			return [response.message];
		} else {
			return response.data;
		}
	}

	async sendGuardCode(code: string): Promise<void> {
		const response = await this._http.post('/user/auth/send_guard_code', {
			code
		});

		console.log(response);
		
	}
}