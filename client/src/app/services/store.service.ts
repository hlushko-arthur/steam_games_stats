import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})

export class StoreService {
	private _prefix = 'afi_';

	set(key: string, value: string): void {
		key = this._prefix + key;

		localStorage.setItem(key, value);
	}

	get(key: string): string | null {
		key = this._prefix + key;

		return localStorage.getItem(key);
	}

	setJson(key: string, value: unknown): void {
		if (typeof value !== 'string') {
			value = JSON.stringify(value);
		}

		this.set(key, value as string);
	}

	getJson<T = unknown>(key: string): T | null {
		key = this._prefix + key;

		const data = localStorage.getItem(key);

		if (!data) {
			return null;
		}

		try {
			return JSON.parse(data);
		} catch (error) {
			console.error(error);

			return null;
		}
	}
}