import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";

@Injectable({
	providedIn: 'root'
})

export class SocketService {

	socket: Socket

	constructor() {
		this.socket = io('ws://localhost:4200', {
			path: '/api/socket.io',
			transports: ['websocket']
		});
	}

	on(name: string, cb: (resp: any) => void = () => { }): void {
		this.socket.on(name, (resp: any) => {
			cb(resp);
		})
	}

}