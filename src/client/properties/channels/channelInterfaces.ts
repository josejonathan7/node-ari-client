import { ISwaggerResponse } from "swagger-client";
import { MountSwaggerPromise } from "../../../utils/mountSwaggerPromise";

export interface IChannel {
	answer(params: {channelId: string}): Promise<void>;
	continueInDialplan(params: IDataToContinueInDialplan): Promise<void>;
	create(params: IDataToCreate): Promise<IChannelCreateResponse["spec"]>;
	dial(params: IDataToDial): Promise<void>;
	externalMedia(params: IDataToExternalMedia): Promise<IChannelExternalMediaResponse["spec"]>;
	get(params: {channelId: string;}): Promise<IChannelGetResponse["spec"]>;
	getChannelVar(params: {channelId: string; variable:string;}): Promise<IChannelGetVariableResponse["spec"]>;
	hangup(params: {channelId: string; reason?: HangUpEnum;}): Promise<void>;
	hold(params: {channelId: string;}): Promise<void>;
	list(): Promise<IChannelListResponse["spec"]>;
}

export type IChannelProps = {
	ariUrl: string;
	credentials: string;
	mountSwaggerPromise: MountSwaggerPromise;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isHangUpEnum: (value: any) => boolean;
}


export interface IDataToContinueInDialplan {
	channelId: string;
	context?: string;
	extension?: string;
	label?: string;
	priority?: number;
}

export interface IDataToDial {
	channelId: string;
	/**
	 * @description id do canal do chamador
	 */
	caller?: string;
	timeout?: number;
}

export interface IDataToCreate {
	app: string;
	/**
	 * @description a sintaxe deve começar com tech/ramal ex: PJSIP/100
	 */
	endpoint: string;
	appArgs?: string;
	channelId?: string;
	formats?: string;
	originator?: string;
	otherChannelId?: string;
}

export interface IDataToExternalMedia {
	app: string;
	externalHost: string;
	format: string;
	channelId?: string;
	connectionType?: string;
	direction?: string;
	encapsulation?: string;
	transport?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	variables?: any;
}


export type IChannelCreateResponse = ISwaggerResponse<IChannelBodyResponse>;
export type IChannelExternalMediaResponse = ISwaggerResponse<IChannelBodyResponse>;
export type IChannelGetResponse = ISwaggerResponse<IChannelBodyResponse>;
export type IChannelGetVariableResponse = ISwaggerResponse<{
	value: string;
}>;
export type IChannelListResponse = ISwaggerResponse<{
	[key: string]: IChannelBodyResponse
}>;

export interface IChannelBodyResponse {
	id: string;
	name: string;
	state: string;
	protocol_id: string;
	caller: {
		name: string;
		number: string;
	};
	connected: {
		name: string;
		number: string;
	};
	accountCode: string;
	dialplan: {
		context: string;
		exten: string;
		priority: number;
		app_name: string;
		app_data: string;
	}
	creationtime: string;
	language: string;
}


export enum HangUpEnum {
	NORMAL = "normal",
	BUSY = "busy",
	CONGESTION = "congestion",
	NO_ANSWER = "no_answer",
	TIMEOUT = "timeout",
	REJECTED = "rejected",
	UNALLOCATED = "unallocated",
	NORMAL_UNSPECIFIED = "normal_unspecified",
	NUMBER_INCOMPLETE = "number_incomplete",
	CODEC_MISMATCH = "codec_mismatch",
	INTERWORKING = "interworking",
	FAILURE = "failure",
	ANSWERED_ELSEWHERE = "answered_elsewhere"
}
