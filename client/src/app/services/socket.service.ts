import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";

@Injectable({
	providedIn: 'root'
})

export class SocketService {

	private _socket: Socket

	constructor() {
		this._socket = io('ws://localhost:4200', {
			path: '/api/socket.io',
			transports: ['websocket']
		});

		this._socket.on('connected', (_id: string) => {
			console.log(_id);
		})
	}

	on(name: string, cb: (resp: any) => void = () => { }): void {
		this._socket.on(name, (resp: any) => {
			cb(resp);
		})
	}

}