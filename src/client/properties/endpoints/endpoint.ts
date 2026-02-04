import { IEndpointGetResponse, IEndpointListByTechResponse, IEndpointListResponse, IEndpoints, IEndpointsProps, IDataToGetParams, IDataToSendMessage, IEndpointSendMessageResponse, IEndpointSendMessageToEndpointResponse, IDataToSendMessageToEndpoint } from "./endpointInterfaces";

export class Endpoint implements IEndpoints {
	private readonly props: IEndpointsProps;
	private readonly knownType = "endpoints";

	constructor(props: IEndpointsProps) {
		this.props = props;
	}

	async get (params: IDataToGetParams) {
		if (!params) {
			throw new Error("param faltou");
		}

		if (typeof params.tech !== "string" || !params.tech.trim()) {
			throw new Error("tech is required");
		}

		if (typeof params.resource !== "string" || !params.resource.trim()) {
			throw new Error("resource is required");
		}

		const pathParams = `/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}`;

		const swaggerResponse = await this.props.mountSwaggerPromise<IEndpointGetResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "GET",
			pathParams,
			resource: this.knownType,
		});

		return swaggerResponse.spec;
	}

	async listByTech(params: {tech: string;}) {
		if (!params || !params.tech) {
			const swaggerResponse= await this.props.mountSwaggerPromise<IEndpointListByTechResponse["spec"]>({
				ariUrl: this.props.ariUrl,
				credentials: this.props.credentials,
				httpMethod: "GET",
				pathParams: "/PJSIP",
				resource: this.knownType
			});

			return swaggerResponse.spec;
		}

		const pathParams = `/${encodeURIComponent(params.tech)}`;
		const swaggerResponse = await this.props.mountSwaggerPromise<IEndpointListByTechResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "GET",
			pathParams,
			resource: this.knownType
		});

		return swaggerResponse.spec;
	}

	async list() {
		const swaggerResponse = await this.props.mountSwaggerPromise<IEndpointListResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "GET",
			resource: this.knownType
		});

		return swaggerResponse.spec;
	}

	async sendMessage(params: IDataToSendMessage) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (params.body) {
			if (typeof params.body !== "string" || !params.body.trim()) {
				throw new Error("body is string type");
			}
		}

		if (typeof params.from !== "string" || !params.from.trim()) {
			throw new Error("from is required");
		}

		if (typeof params.to !== "string" || !params.to.trim()) {
			throw new Error("to is required");
		}

		const url = "endpoints/sendMessage";
		const body = params.body ? "&body=".concat(encodeURIComponent(params.body)) : "";
		const queryParams = `?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}${body}`;
		const swaggerResponse = await this.props.mountSwaggerPromise<IEndpointSendMessageResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "PUT",
			queryParams,
			resource: url
		});

		return swaggerResponse.spec;
	}

	async sendMessageToEndpoint(params: IDataToSendMessageToEndpoint) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (params.body) {
			if (typeof params.body !== "string" || !params.body.trim()) {
				throw new Error("body is string type");
			}
		}

		if (typeof params.from !== "string" || !params.from.trim()) {
			throw new Error("from is required");
		}

		if (typeof params.resource !== "string" || !params.resource.trim()) {
			throw new Error("resource is required");
		}

		if (typeof params.tech !== "string" || !params.tech.trim()) {
			throw new Error("tech is required");
		}

		const url = `endpoints/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}/sendMessage`;
		const body = params.body ? "&body=".concat(encodeURIComponent(params.body)) : "";

		const queryParams = `?from=${encodeURIComponent(params.from)}${body}`;
		const swaggerResponse = await this.props.mountSwaggerPromise<IEndpointSendMessageToEndpointResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "PUT",
			queryParams,
			resource: url
		});

		return swaggerResponse.spec;
	}
}
