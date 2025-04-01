interface SuccessResponse<T> {
	status: true;
	data: T
}

interface ErrorResponse {
	status: false;
	message: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export namespace UserServiceAPI {
	export namespace FETCH {
		export interface Payload {
			steamId: string;
			profileOnly?: boolean;
		}
	}
}