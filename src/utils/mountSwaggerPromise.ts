import swagger, { ISwaggerErrorResponse, ISwaggerResponse } from "swagger-client";

interface IDataToRequestSwagger {
	ariUrl: string;
	credentials: string;
	resource: string;
	httpMethod: string;
	pathParams?: string;
	queryParams?: string;
}

export type MountSwaggerPromise = <K>(data: IDataToRequestSwagger) => Promise<ISwaggerResponse<K>>

export const mountSwaggerPromise: MountSwaggerPromise = (data: IDataToRequestSwagger) => {
	return swagger({
		url: data.ariUrl,
		requestInterceptor: (req) => {
			let formatUrl = req.url.split("/api-docs")[0].concat(`/${data.resource}`);

			if (data.pathParams) {
				formatUrl = formatUrl.concat(data.pathParams);
			}

			if (data.queryParams) {
				formatUrl = formatUrl.concat(data.queryParams);
			}

			req.url = formatUrl;
			req.method = data.httpMethod;
			req.headers["Authorization"] = `Basic ${data.credentials}`;
			console.log(req);

			return req;
		},
		responseInterceptor: (res) => {
			if (!res.ok) {
				const error = res as ISwaggerErrorResponse;

				return {
					body: error.body,
					data: error.data,
					headers: error.headers,
					status: error.status,
				};
			}

			if (res.spec) {
				return res.spec;
			}

			return res;
		}
	});
};
