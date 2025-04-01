import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StoreService } from "src/app/services/store.service";
import { User } from "../interfaces/steam.interface";

@Injectable()
export class GuestGuard implements CanActivate {
	constructor(private _store: StoreService, private _router: Router) {}

	canActivate(): boolean {
		const user = this._store.getJson<User>('user');

		if (user?.steamId) {
			this._router.navigateByUrl(`/profile/${user?.steamId}`);

			return false;
		}

		return true;
	}
}