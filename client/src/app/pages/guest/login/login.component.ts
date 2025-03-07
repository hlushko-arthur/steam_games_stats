import { Component } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { SocketService } from "src/app/services/socket.service";

@Component({
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	standalone: true
})

export class LoginComponent {

	isPasswordVisible: boolean = false;

	constructor(private _http: HttpService, private _socket: SocketService) { }

	async loginManually(): Promise<void> {
		this._socket.on('qrCode', (resp: any) => {
			console.log(resp);

		})
		this._http.get('/api/steam/auth/qr')
	}

	changePasswordVisibility(): void {
		this.isPasswordVisible = !this.isPasswordVisible;
	}

}