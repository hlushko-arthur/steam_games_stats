import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { SocketService } from "src/app/services/socket.service";
import { SteamAuthService } from "src/app/services/steam-auth.service";

@Component({
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	standalone: true
})

export class LoginComponent implements OnInit {

	isPasswordVisible: boolean = false;

	constructor(private _http: HttpService, private _socket: SocketService, private _steamAuth: SteamAuthService) { }

	ngOnInit(): void {
		this._steamAuth.startQRAuth();
	}

	async loginManually(): Promise<void> {
		this._socket.on('qrCode', (resp: any) => {
			console.log(resp);

		})
		this._http.get('/api/steam/auth/qr')
	}

	changePasswordVisibility(): void {
		this.isPasswordVisible = !this.isPasswordVisible;
	}

	get qrCode(): string {
		return this._steamAuth.qrUrl();
	}

}