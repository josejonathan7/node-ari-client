import { ISwaggerResponse } from "swagger-client";
import { MountSwaggerPromise } from "../../../utils/mountSwaggerPromise";

//----------------propriedade endpoints------------------
export type IEndpointsProps = {
	mountSwaggerPromise: MountSwaggerPromise;
	ariUrl: string;
	credentials: string;
}

export interface IEndpoints {
	get(params: IDataToGetParams): Promise<IEndpointGetResponse["spec"]>;
	list(): Promise<IEndpointListResponse["spec"]>;
	listByTech(params: {tech: string;}): Promise<IEndpointListByTechResponse["spec"]>;
	sendMessage(params: IDataToSendMessage): Promise<IEndpointSendMessageResponse["spec"]>
	sendMessageToEndpoint(data: IDataToSendMessageToEndpoint): Promise<IEndpointSendMessageToEndpointResponse["spec"]>;
}


export type IEndpointGetResponse = ISwaggerResponse<IEndpointBodyResponse>;
export type IEndpointListResponse = ISwaggerResponse<{
     [key: string]: IEndpointBodyResponse;
}>;
export type IEndpointListByTechResponse= IEndpointListResponse;
export type IEndpointSendMessageResponse = ISwaggerResponse<void>;
export type IEndpointSendMessageToEndpointResponse = ISwaggerResponse<void>;

export interface IEndpointBodyResponse {
    technology: string;
    resource: string;
    state: string;
    channel_ids: string[];
}

export interface IDataToGetParams {
	tech: string;
	resource: string;
}

export interface IDataToSendMessage {
	to: string;
	from: string;
	body?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	variables?: any;
}

export interface IDataToSendMessageToEndpoint {
	from: string;
	resource: string;
	tech: string;
	body?: string;
}

