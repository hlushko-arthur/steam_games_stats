import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { SocketService } from "src/app/services/socket.service";
import { SteamAuthService } from "src/app/services/auth.service";

@Component({
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	standalone: true
})

export class LoginComponent implements OnInit {

	isPasswordVisible = false;

	constructor(private _http: HttpService, private _socket: SocketService, private _auth: SteamAuthService) { }

	ngOnInit(): void {
		this._auth.startQRAuth();
	}

	async loginManually(): Promise<void> {
		this._socket.on('qrCode', (resp: any) => {
			console.log(resp);

		});

		this._http.get('/api/steam/auth/qr');
	}

	changePasswordVisibility(): void {
		this.isPasswordVisible = !this.isPasswordVisible;
	}

	get qrCode(): string {
		return this._auth.qrUrl();
	}

}