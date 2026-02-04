import { IBridge, IBridgeAddChannelResponse, IBridgeCreateResponse, IBridgeCreateWihIdResponse, IBridgeGetResponse, IBridgeListResponse, IBridgePlayResponse, IBridgePlayWithIdResponse, IBridgeProps, IBridgeRecordResponse, IDataToAddChannel, IDataToCreateBridge, IDataToCreateWithIdBridge, IDataToPlayBridge, IDataToPlayWithIdBridge, IDataToRecordBridge } from "./bridgeInterfaces";


export class Bridge implements IBridge {
	private readonly props: IBridgeProps;
	private readonly knowType = "bridges";

	constructor(props: IBridgeProps) {
		this.props = props;
	}

	async addChannel(params: IDataToAddChannel) {
		if (!params || typeof params !== "object") {
			throw new Error("data object is required");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
			throw new Error("bridgeId is required");
		}

		if (typeof params.channel !== "string" && !Array.isArray(params.channel)) {
			throw new Error("channel is required");
		}

		if (Array.isArray(params.channel)) {
			if (!params.channel.every(k => typeof k === "string")) {
				throw new Error("channel is required");
			}
		}

		if (typeof params.absorbDTMF !== "boolean" && typeof params.absorbDTMF !== "undefined") {
			throw new Error("absorbDTMF is boolean");
		}

		if (typeof params.mute !== "undefined" && typeof params.mute !== "boolean") {
			throw new Error("mute is boolean");
		}

		if (params.role) {
			if (typeof params.role !== "string" || !params.role.trim()) {
				throw new Error("role is string");
			}
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}/addChannel`;
		let queryParams = `?channel=${encodeURIComponent(Array.isArray(params.channel) ? params.channel.join(",") : params.channel)}`;
		if(params.absorbDTMF) {
			queryParams = `${queryParams}&absorbDTMF=${encodeURIComponent(params.absorbDTMF)}`;
		}

		if(params.mute) {
			queryParams = `${queryParams}&mute=${encodeURIComponent(params.mute)}`;
		}

		if(params.role) {
			queryParams = `${queryParams}&role=${encodeURIComponent(params.role)}`;
		}

		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeAddChannelResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			pathParams,
			queryParams,
			resource: this.knowType
		});

		return swaggerResponse.spec;
	};

	async clearVideoSource(params: {bridgeId: string;}) {
		if (!params) {
			throw new Error("bridgeId is rquired");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId) {
			throw new Error("bridgeId is rquired");
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}/videoSource`;
		await this.props.mountSwaggerPromise<void>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "DELETE",
			pathParams,
			resource: this.knowType
		});
	};

	async create (params: IDataToCreateBridge) {
		if (params.bridgeId) {
			if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
				throw new Error("bridgeId is string");
			}
		}

		if (params.name) {
			if (typeof params.name !== "string" || !params.name.trim()) {
				throw new Error("name is string");
			}
		}

		if (params.type) {
			if (typeof params.type !== "string" || !params.type.trim()) {
				throw new Error("type is string");
			}
		}

		const bridgeId = params.bridgeId ? `bridgeId=${encodeURIComponent(params.bridgeId)}&` : undefined;
		const name = params.name ? `name=${encodeURIComponent(params.name)}&` : undefined;
		const type = params.type ? `type=${encodeURIComponent(params.type)}&` : undefined;

		let queryParams: string | undefined = "?";
		if (name) {
			queryParams = `${queryParams}${name}`;
		}

		if (bridgeId) {
			queryParams = `${queryParams}${bridgeId}`;
		}

		if (type) {
			queryParams = `${queryParams}${type}`;
		}

		queryParams = queryParams.length > 1 ? queryParams.replace(/.$/, "") : undefined;

		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeCreateResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			queryParams
		});

		return swaggerResponse.spec;
	};

	async createWithId(params: IDataToCreateWithIdBridge){
		if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
			throw new Error("bridgeId is string");
		}

		if (params.name) {
			if (typeof params.name !== "string" || !params.name.trim()) {
				throw new Error("name is string");
			}
		}

		if (params.type) {
			if (typeof params.type !== "string" || !params.type.trim()) {
				throw new Error("type is string");
			}
		}

		const name = params.name ? `name=${encodeURIComponent(params.name)}&` : undefined;
		const type = params.type ? `type=${encodeURIComponent(params.type)}&` : undefined;

		let queryParams: string | undefined = "?";
		if (name) {
			queryParams = `${queryParams}${name}`;
		}

		if (type) {
			queryParams = `${queryParams}${type}`;
		}

		queryParams = queryParams.length > 1 ? queryParams.replace(/.$/, "") : undefined;
		const pathParams = `/${encodeURIComponent(params.bridgeId)}`;
		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeCreateWihIdResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			pathParams,
			queryParams,
			resource: this.knowType,
		});

		return swaggerResponse.spec;
	};

	async destroy(params: {bridgeId: string;}) {
		if (!params) {
			throw new Error("bridgeId is rquired");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId) {
			throw new Error("bridgeId is rquired");
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}`;
		await this.props.mountSwaggerPromise<void>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "DELETE",
			pathParams,
			resource: this.knowType
		});
	};

	async get(params: {bridgeId: string;}) {
		if (!params) {
			throw new Error("bridgeId is rquired");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId) {
			throw new Error("bridgeId is rquired");
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}`;
		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeGetResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "GET",
			pathParams,
			resource: this.knowType
		});

		return swaggerResponse.spec;
	};

	async list() {
		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeListResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "GET",
			resource: this.knowType
		});

		return swaggerResponse.spec;
	};

	async play(params: IDataToPlayBridge) {
		if (!params || typeof params !== "object") {
			throw new Error("data object is required");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
			throw new Error("bridgeId is required");
		}

		if (typeof params.media !== "string" && !Array.isArray(params.media)) {
			throw new Error("media is required");
		}

		if (Array.isArray(params.media)) {
			if (!params.media.every(k => typeof k === "string")) {
				throw new Error("media is required");
			}
		}

		if (params.lang) {
			if (typeof params.lang !== "string" || !params.lang.trim()) {
				throw new Error("lang is string");
			}
		}

		if (params.playbackId) {
			if (typeof params.playbackId !== "string" || !params.playbackId.trim()) {
				throw new Error("playbackId is string");
			}
		}

		if (params.offsetms && !Number.isInteger(params.offsetms)) {
			throw new Error("offsetms is number");
		}

		if (params.skipms && !Number.isInteger(params.skipms)) {
			throw new Error("skipms is number");
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}/play`;
		let queryParams = `?media=${encodeURIComponent(Array.isArray(params.media) ? params.media.join(",") : params.media)}`;
		if (params.lang) {
			queryParams = `${queryParams}&lang=${encodeURIComponent(params.lang)}`;
		}

		if (params.offsetms) {
			queryParams = `${queryParams}&offsetms=${encodeURIComponent(params.offsetms)}`;
		}

		if (params.skipms) {
			queryParams = `${queryParams}&skipms=${encodeURIComponent(params.skipms)}`;
		}

		if (params.playbackId) {
			queryParams = `${queryParams}&playbackId=${encodeURIComponent(params.playbackId)}`;
		}

		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgePlayResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			pathParams,
			queryParams,
			resource: this.knowType
		});

		return swaggerResponse.spec;
	};

	async playWithId (params: IDataToPlayWithIdBridge) {
		if (!params || typeof params !== "object") {
			throw new Error("data object is required");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
			throw new Error("bridgeId is required");
		}

		if (typeof params.media !== "string" && !Array.isArray(params.media)) {
			throw new Error("media is required");
		}

		if (Array.isArray(params.media)) {
			if (!params.media.every(k => typeof k === "string")) {
				throw new Error("media is required");
			}
		}

		if (params.lang) {
			if (typeof params.lang !== "string" || !params.lang.trim()) {
				throw new Error("lang is string");
			}
		}

		if (typeof params.playbackId !== "string" || !params.playbackId.trim()) {
			throw new Error("playbackId is required");
		}

		if (params.offsetms && !Number.isInteger(params.offsetms)) {
			throw new Error("offsetms is number");
		}

		if (params.skipms && !Number.isInteger(params.skipms)) {
			throw new Error("skipms is number");
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}/play/${encodeURIComponent(params.playbackId)}`;

		let queryParams = `?media=${encodeURIComponent(Array.isArray(params.media) ? params.media.join(",") : params.media)}`;
		if (params.lang) {
			queryParams = `${queryParams}&lang=${encodeURIComponent(params.lang)}`;
		}

		if (params.offsetms) {
			queryParams = `${queryParams}&offsetms=${encodeURIComponent(params.offsetms)}`;
		}

		if (params.skipms) {
			queryParams = `${queryParams}&skipms=${encodeURIComponent(params.skipms)}`;
		}

		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgePlayWithIdResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			pathParams,
			queryParams,
			resource: this.knowType
		});

		return swaggerResponse.spec;
	};

	async record(params: IDataToRecordBridge) {
		if (!params || typeof params !== "object") {
			throw new Error("data object is required");
		}

		if (typeof params.bridgeId !== "string" || !params.bridgeId.trim()) {
			throw new Error("bridgeId is required");
		}


		if (typeof params.format !== "string" || !params.format.trim()) {
			throw new Error("format is required");
		}

		if (typeof params.name !== "string" || !params.name.trim()) {
			throw new Error("name is required");
		}

		if (params.ifExists) {
			if (typeof params.ifExists !== "string" || !params.ifExists.trim()) {
				throw new Error("ifExists is string");
			}
		}

		if (params.terminateOn) {
			if (typeof params.terminateOn !== "string" || !params.terminateOn.trim()) {
				throw new Error("terminateOn is string");
			}
		}

		if (params.maxDurationSeconds && !Number.isInteger(params.maxDurationSeconds)) {
			throw new Error("maxDurationSeconds is number");
		}

		if (params.maxSilenceSeconds && !Number.isInteger(params.maxSilenceSeconds)) {
			throw new Error(".maxSilenceSeconds is number");
		}

		let queryParams = `?name=${encodeURIComponent(params.name)}&format=${encodeURIComponent(params.format)}`;
		if (params.maxDurationSeconds) {
			queryParams = `${queryParams}&maxDurationSeconds=${params.maxDurationSeconds}`;
		}

		if (params.maxSilenceSeconds) {
			queryParams = `${queryParams}&maxSilenceSeconds=${params.maxSilenceSeconds}`;
		}

		if (params.ifExists) {
			queryParams = `${queryParams}&ifExists=${encodeURIComponent(params.ifExists)}`;
		}

		if(params.beep === false || params.beep === true) {
			queryParams = `${queryParams}&beep=${params.beep}`;
		}

		if (params.terminateOn) {
			queryParams = `${queryParams}&terminateOn=${encodeURIComponent(params.terminateOn)}`;
		}

		const pathParams = `/${encodeURIComponent(params.bridgeId)}/record`;

		const swaggerResponse = await this.props.mountSwaggerPromise<IBridgeRecordResponse["spec"]>({
			ariUrl: this.props.ariUrl,
			credentials: this.props.credentials,
			httpMethod: "POST",
			resource: this.knowType,
			pathParams,
			queryParams
		});

		return swaggerResponse.spec;
	};
}

