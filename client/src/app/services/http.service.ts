import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../core/interfaces/api.interface';
// import { environment } from '@environment/environment';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private _httpClient: HttpClient, private _router: Router) { }

	post(url: string, payload: any): Promise<any> {
		// url = environment.serverUrl + url;

		return new Promise((resolve, reject) => {
			this._httpClient.post<unknown>(url, payload).subscribe(
				(resp) => {
					resolve(resp);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					reject(error);
				}
			);
		});
	}

	get<T = any>(url: string): Promise<T> {
		// url = environment.serverUrl + url;

		return new Promise<T>((resolve, reject) => {
			this._httpClient.get<Response<T>>(url).subscribe(
				(resp) => {
					resolve(resp.data);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					reject(error);
				}
			);
		});
	}

	checkTokenState(error: { error: { message: string } }): void {
		if (error.error.message === 'Invalid token' || error.error.message === 'Expired token' || error.error.message === 'Unauthorized') {
			localStorage.removeItem('user');

			this._router.navigateByUrl('/');
		}
	}
}