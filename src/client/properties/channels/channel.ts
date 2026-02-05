import { MountSwaggerPromise } from "../../../utils/mountSwaggerPromise";
import { HangUpEnum, IChannel, IChannelCreateResponse, IChannelExternalMediaResponse, IChannelGetResponse, IChannelGetVariableResponse, IChannelListResponse, IChannelProps, IDataToContinueInDialplan, IDataToCreate, IDataToDial, IDataToExternalMedia } from "./channelInterfaces";


export class Channel implements IChannel {
	private readonly knowType = "channels";
	private readonly ariUrl: string;
	private readonly credentials: string;
	private readonly mountSwaggerPromise: MountSwaggerPromise;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly isHangUpEnum: (value: any) => boolean;

	constructor(props: IChannelProps) {
		this.ariUrl = props.ariUrl;
		this.credentials = props.credentials;
		this.mountSwaggerPromise = props.mountSwaggerPromise;
		this.isHangUpEnum = props.isHangUpEnum;
	}

	async answer(params: { channelId: string; }) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is required");
		}

		const pathParams = `/${encodeURIComponent(params.channelId)}/answer`;
		await this.mountSwaggerPromise<void>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			pathParams,
			resource: this.knowType
		});
	}

	async continueInDialplan(params: IDataToContinueInDialplan) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is required");
		}

		if (params.context) {
			if (typeof params.context !== "string" || !params.context.trim()) {
				throw new Error("context is string");
			}
		}

		if (params.extension) {
			if (typeof params.extension !== "string" || !params.extension.trim()) {
				throw new Error("extension is string");
			}
		}

		if (params.label) {
			if (typeof params.label !== "string" || !params.label.trim()) {
				throw new Error("label is string");
			}
		}

		if (params.priority && !Number.isInteger(params.priority)) {
			throw new Error("priority is number");
		}

		let queryParams: string | undefined = "?";
		if (params.context) {
			queryParams = `${queryParams}context=${encodeURIComponent(params.context)}&`;
		}

		if (params.extension) {
			queryParams = `${queryParams}extension=${encodeURIComponent(params.extension)}&`;
		}

		if (params.priority) {
			queryParams = `${queryParams}priority=${encodeURIComponent(params.priority)}&`;
		}

		if (params.label) {
			queryParams = `${queryParams}label=${encodeURIComponent(params.label)}&`;
		}

		queryParams = queryParams.length > 1 ? queryParams.replace(/.$/, "") : undefined;
		const pathParams = `/${encodeURIComponent(params.channelId)}/continue`;
		await this.mountSwaggerPromise<void>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			pathParams,
			queryParams,
			resource: this.knowType
		});
	}

	async create(params: IDataToCreate){
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.app !== "string" || !params.app.trim()) {
			throw new Error("app is string");
		}

		if (typeof params.endpoint !== "string" || !params.endpoint.trim()) {
			throw new Error("endpoint is string");
		}

		if (params.channelId) {
			if (typeof params.channelId !== "string" || !params.channelId.trim()) {
				throw new Error("channelId is string");
			}
		}

		if (params.appArgs) {
			if (typeof params.appArgs !== "string" || !params.appArgs.trim()) {
				throw new Error("appArgs is string");
			}
		}

		if (params.formats) {
			if (typeof params.formats !== "string" || !params.formats.trim()) {
				throw new Error("formats is string");
			}
		}

		if (params.originator) {
			if (typeof params.originator !== "string" || !params.originator.trim()) {
				throw new Error("originator is string");
			}
		}

		if (params.otherChannelId) {
			if (typeof params.otherChannelId !== "string" || !params.otherChannelId.trim()) {
				throw new Error("otherChannelId is string");
			}
		}

		let queryParams = `?app=${encodeURIComponent(params.app)}&endpoint=${encodeURIComponent(params.endpoint)}`;
		if (params.appArgs) {
			queryParams = `${queryParams}&appArgs=${encodeURIComponent(params.appArgs)}`;
		}

		if (params.channelId) {
			queryParams = `${queryParams}&channelId=${encodeURIComponent(params.channelId)}`;
		}

		if (params.otherChannelId) {
			queryParams = `${queryParams}&otherChannelId=${encodeURIComponent(params.otherChannelId)}`;
		}

		if (params.originator) {
			queryParams = `${queryParams}&originator=${encodeURIComponent(params.originator)}`;
		}

		if (params.formats) {
			queryParams = `${queryParams}&formats=${encodeURIComponent(params.formats)}`;
		}

		const swaggerResponse = await this.mountSwaggerPromise<IChannelCreateResponse["spec"]> ({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			queryParams
		});

		return swaggerResponse.spec;
	}

	async dial(params: IDataToDial) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is string");
		}

		if (params.caller) {
			if (typeof params.caller !== "string" || !params.caller.trim()) {
				throw new Error("caller is string");
			}
		}

		if (params.timeout && !Number.isInteger(params.timeout)) {
			throw new Error("timeout is number");
		}

		const pathParams = `/${encodeURIComponent(params.channelId)}/dial`;
		let queryParams: string | undefined = "?";

		if (params.caller) {
			queryParams = `${queryParams}caller=${encodeURIComponent(params.caller)}&`;
		}

		if (params.timeout) {
			queryParams = `${queryParams}timeout=${encodeURIComponent(params.timeout)}&`;
		}

		queryParams = queryParams.length > 1 ? queryParams.replace(/.$/, "") : undefined;

		await this.mountSwaggerPromise<void>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			pathParams,
			queryParams
		});
	}

	async list() {
		const swaggerResponse = await this.mountSwaggerPromise<IChannelListResponse["spec"]>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "GET",
			resource: this.knowType
		});

		return swaggerResponse.spec;
	}

	async externalMedia(params: IDataToExternalMedia) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.app !== "string" || !params.app.trim()) {
			throw new Error("app is string required");
		}

		if (typeof params.format !== "string" || !params.format.trim()) {
			throw new Error("format is string required");
		}

		if (params.channelId) {
			if (typeof params.channelId !== "string" || !params.channelId.trim()) {
				throw new Error("channelId is string");
			}
		}

		if (params.connectionType) {
			if (typeof params.connectionType !== "string" || !params.connectionType.trim()) {
				throw new Error("connectionType is string");
			}
		}

		if (params.direction) {
			if (typeof params.direction !== "string" || !params.direction.trim()) {
				throw new Error("direction is string");
			}
		}

		if (params.encapsulation) {
			if (typeof params.encapsulation !== "string" || !params.encapsulation.trim()) {
				throw new Error("encapsulation is string");
			}
		}

		if (params.externalHost) {
			if (typeof params.externalHost !== "string" || !params.externalHost.trim()) {
				throw new Error("externalHost is string");
			}
		}

		if (params.transport) {
			if (typeof params.transport !== "string" || !params.transport.trim()) {
				throw new Error("transport is string");
			}
		}


		if (params.variables) {
			if (typeof params.variables !== "string" || !params.variables.trim()) {
				throw new Error("variables is string");
			}
		}

		const pathParams = "/externalMedia";
		let queryParams = `?app=${encodeURIComponent(params.app)}&format=${encodeURIComponent(params.format)}&external_host=${encodeURIComponent(params.externalHost)}`;
		if (params.channelId) {
			queryParams = `${queryParams}&channelId=${encodeURIComponent(params.channelId)}`;
		}

		if (params.connectionType) {
			queryParams = `${queryParams}&connectionType=${encodeURIComponent(params.connectionType)}`;
		}

		if (params.direction) {
			queryParams = `${queryParams}&direction=${encodeURIComponent(params.direction)}`;
		}

		if (params.encapsulation) {
			queryParams = `${queryParams}&encapsulation=${encodeURIComponent(params.encapsulation)}`;
		}

		if (params.transport) {
			queryParams = `${queryParams}&transport=${encodeURIComponent(params.transport)}`;
		}

		const swaggerResponse = await this.mountSwaggerPromise<IChannelExternalMediaResponse["spec"]>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			pathParams,
			queryParams
		});

		return swaggerResponse.spec;
	}

	async get(params: { channelId: string; }) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is string required");
		}

		const pathParams = `/${params.channelId}`;
		const swaggerResponse = await this.mountSwaggerPromise<IChannelGetResponse["spec"]>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "GET",
			resource: this.knowType,
			pathParams
		});

		return swaggerResponse.spec;
	}

	async getChannelVar(params: { channelId: string; variable: string; }) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is string required");
		}

		if (typeof params.variable !== "string" || !params.variable.trim()) {
			throw new Error("variable is string required");
		}

		const pathParams = `/${params.channelId}/variable`;
		const queryParams = `?variable=${encodeURIComponent(params.variable)}`;
		const swaggerResponse = await this.mountSwaggerPromise<IChannelGetVariableResponse["spec"]>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "GET",
			resource: this.knowType,
			pathParams,
			queryParams
		});

		return swaggerResponse.spec;
	}

	async hangup(params: { channelId: string; reason?: HangUpEnum; }) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is string required");
		}

		if (params.reason) {
			if (!this.isHangUpEnum(params.reason))
				throw new Error(`reason accepts values: ${Object.values(HangUpEnum).join(",")}`);
		}

		const pathParams = `/${params.channelId}`;
		const queryParams = params.reason ? `?reason=${encodeURIComponent(params.reason)}` : undefined;
		await this.mountSwaggerPromise<void>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "DELETE",
			resource: this.knowType,
			pathParams,
			queryParams
		});
	}

	async hold(params: { channelId: string; }) {
		if (typeof params !== "object") {
			throw new Error("param object is required");
		}

		if (typeof params.channelId !== "string" || !params.channelId.trim()) {
			throw new Error("channelId is string required");
		}

		const pathParams = `/${params.channelId}/hold`;
		await this.mountSwaggerPromise<void>({
			ariUrl: this.ariUrl,
			credentials: this.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			pathParams,
		});
	}
}
