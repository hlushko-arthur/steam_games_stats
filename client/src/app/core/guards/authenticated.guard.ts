import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { StoreService } from "src/app/services/store.service";
import { User } from "../interfaces/steam.interface";

@Injectable()
export class Authenticated implements CanActivate {
	constructor(private _store: StoreService) {}

	canActivate(): boolean {
		const user = this._store.getJson<User>('user');

		if (user?.steamId) {
			return true;
		}

		return false;
	}
}