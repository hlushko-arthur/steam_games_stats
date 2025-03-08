import { Injectable, signal } from "@angular/core";
import { HttpService } from "./http.service";
import { SocketService } from "./socket.service";
import { SAuthenticated } from "../core/interfaces/socket.interface";

@Injectable({
	providedIn: 'root'
})

export class SteamAuthService {

	qrUrl = signal('');

	constructor(private _http: HttpService, private _socket: SocketService) {
		this._socket.on('qrCode', (url: string) => {
			this.qrUrl.set(url);
		})

		this._socket.on('authenticated', (data: SAuthenticated) => {
			console.log('authenticated', data);

		})
	}

	async startQRAuth(): Promise<void> {
		this._http.get('/steam/auth/qr');
	}

}