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

	private readonly _prefix = '/api';

	post<T = unknown, D = Response<T>>(url: string, payload: Record<string, unknown>): Promise<D> {
		// url = environment.serverUrl + url;
		url = this._prefix + url;

		return new Promise((resolve, reject) => {
			this._httpClient.post<D>(url, payload).subscribe(
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

	get<T = unknown, TResponse = Response<T>>(url: string): Promise<TResponse> {
		// url = environment.serverUrl + url;

		url = this._prefix + url;

		return new Promise<TResponse>((resolve, reject) => {
			this._httpClient.get<TResponse>(url).subscribe(
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

	checkTokenState(error: { error: { message: string } }): void {
		if (error.error.message === 'Invalid token' || error.error.message === 'Expired token' || error.error.message === 'Unauthorized') {
			localStorage.removeItem('user');

			this._router.navigateByUrl('/');
		}
	}
}