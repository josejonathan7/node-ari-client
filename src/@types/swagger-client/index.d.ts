declare module "swagger-client" {
	function Swagger (ari: (string | ISwaggerRequestOptions), options?: ISwaggerRequestOptions): Promise<ISwaggerResponse<K>>;

	export interface ISwaggerResponse<K>{
		url: string;
		loadSpec: boolean;
		requestInterceptor: (req) => req,
		responseInterceptor: (res) => res,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		originalSpec?: any;
		spec: K;
		errors: [];
		apis: object
	}

	export interface ISwaggerRequestOptions {
		 url: string;
		requestInterceptor: (req) => void;
		responseInterceptor: (res) => void;
	}

	export interface ISwaggerErrorResponse {
		ok: boolean;
		url: string;
		status: number;
		statusText: string;
		headers: object;
		text: string;
		data: string;
		body: object;
		obj: object;

	}


	export = Swagger
}






