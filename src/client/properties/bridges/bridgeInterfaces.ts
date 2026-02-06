import { ISwaggerResponse } from "swagger-client";
import { MountSwaggerPromise } from "../../../utils/mountSwaggerPromise";


export interface IBridge {
	addChannel(params: IDataToAddChannel): Promise<void>;
	clearVideoSource(params: {bridgeId: string;}): Promise<void>;
	create(params: IDataToCreateBridge): Promise<IBridgeCreateResponse["spec"]>;
	createWithId(params: IDataToCreateWithIdBridge): Promise<IBridgeCreateWihIdResponse["spec"]>;
	destroy(params: {bridgeId: string;}): Promise<void>;
	get(params: {bridgeId: string;}): Promise<IBridgeGetResponse["spec"] | undefined>;
	list(): Promise<IBridgeListResponse["spec"]>;
	play(params: IDataToPlayBridge): Promise<IBridgePlayResponse["spec"]>;
	playWithId(params: IDataToPlayWithIdBridge): Promise<IBridgePlayWithIdResponse["spec"]>;
	record(params: IDataToRecordBridge): Promise<IBridgeRecordResponse["spec"]>;
	removeChannel(params: {bridgeId: string; channel: string | string[];}): Promise<void>;
	setVideoSource(params: {bridgeId: string; channelId: string;}): Promise<void>;
	startMoh(params: {bridgeId: string; mohClass?: string;}): Promise<void>;
	stopMoh(params: {bridgeId: string;}): Promise<void>;
}

export type IBridgeProps = {
	mountSwaggerPromise: MountSwaggerPromise;
	ariUrl: string;
	credentials: string;
}


export interface IDataToAddChannel {
	bridgeId: string;
	channel: string | string[];
	absorbDTMF?: boolean;
	mute?: boolean;
	role?: string;
}

export interface IDataToCreateBridge {
	bridgeId?: string;
	name?: string;
	type?: string;
}

export interface IDataToCreateWithIdBridge extends Pick<IDataToCreateBridge, "name" | "type">{
	bridgeId: string;
}

export interface IDataToPlayBridge {
	bridgeId: string;
	media: string | string[];
	lang?: string;
	offsetms?: number;
	playbackId?: string;
	skipms?: number;
}

export interface IDataToPlayWithIdBridge extends Omit<IDataToPlayBridge, "playbackId"> {
	playbackId: string;
}

export interface IDataToRecordBridge {
	bridgeId: string;
	format: string;
	name: string;
	beep?: boolean;
	ifExists?: string;
	maxDurationSeconds?: number;
	maxSilenceSeconds?: number;
	terminateOn?: string;
}


export type IBridgeCreateResponse = ISwaggerResponse<IBridgeBodyResponse>;
export type IBridgeCreateWihIdResponse = ISwaggerResponse<IBridgeBodyResponse>;
export type IBridgeGetResponse = ISwaggerResponse<IBridgeBodyResponse>;
export type IBridgeListResponse = ISwaggerResponse<{
    [key: string]: IBridgeBodyResponse;
}>;
export type IBridgePlayResponse = ISwaggerResponse<{
    id: string;
    media_uri: string;
    target_uri: string;
    language: string;
    state: string;
}>;

export type IBridgePlayWithIdResponse = IBridgePlayResponse;
export type IBridgeRecordResponse = ISwaggerResponse<{
	name: string;
	format: string;
	state: string;
	target_uri: string;
}>

export interface IBridgeBodyResponse {
    id: string;
    technology: string;
    bridge_type: string;
    bridge_class: string;
    creator: string;
    name: string;
    channels: string[];
    creationtime: Date;
    video_mode: string;
	video_source_id?: string;
}
