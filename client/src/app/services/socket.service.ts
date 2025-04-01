import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
@Injectable({
	providedIn: 'root'
})

export class SocketService {

	private _socket: Socket;

	constructor() {
		this.setSocketCookies();

		this._socket = io('ws://localhost:4200', {
			path: '/api/socket.io',
			transports: ['websocket']
		});

		this.emit('connected');
	}

	on<T = unknown>(name: string, cb: (resp: T) => void): void {
		this._socket.on(name, (resp: T) => {
			cb?.(resp);
		});
	}

	emit(name: string, data?: unknown): void {
		this._socket.emit(name, data);
	}

	setSocketCookies(): void {
		const id = nanoid();

		document.cookie = `SUID=${id}; path=/`;		
	}
}