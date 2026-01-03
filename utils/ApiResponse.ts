export class ApiResponse<T> {
	message: string;
	data: T;

	constructor(data: T, message: string = "Success") {
		this.message = message;
		this.data = data;
	}
}
