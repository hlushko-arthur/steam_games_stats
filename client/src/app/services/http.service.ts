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

	post<T = unknown>(url: string, payload: object): Promise<Response<T>> {
		// url = environment.serverUrl + url;
		url = this._prefix + url;

		return new Promise((resolve) => {
			this._httpClient.post<Response<T>>(url, payload).subscribe(
				(resp) => {
					resolve(resp);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					const response: Response<T> = {
						status: false,
						message: error.error.message
					};

					resolve(response);
				}
			);
		});
	}

	get<T = unknown>(url: string): Promise<Response<T>> {
		// url = environment.serverUrl + url;

		url = this._prefix + url;

		return new Promise<Response<T>>((resolve) => {
			this._httpClient.get<Response<T>>(url).subscribe(
				(resp) => {
					resolve(resp);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					const response: Response<T> = {
						status: false,
						message: error.error.message
					};

					resolve(response);
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