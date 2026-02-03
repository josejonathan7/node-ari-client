import swagger from "swagger-client";

interface IDataToRequestSwagger {
	ariUrl: string;
	credentials: string;
	resource: string;
	httpMethod: string;
	pathParams?: string;
	queryParams?: string;
}

export type MountSwaggerPromise = (data: IDataToRequestSwagger) => Promise<any>

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
				console.log(res);

				throw new Error(res);
			}

			if (res.spec) {
				return res.spec;
			}

			return res;
		}
	});
};
