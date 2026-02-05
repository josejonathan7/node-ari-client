import { EventEmitter } from "node:stream";
import { Resources } from "../interfaces/events";
import { IBridge } from "./properties/bridges/bridgeInterfaces";
import { IEndpoints } from "./properties/endpoints/endpointInterfaces";
import { IChannel } from "./properties/channels/channelInterfaces";



export interface IClient extends EventEmitter {
	on<K extends keyof Resources>(event: K, listener: Resources[K]): this;
	//ping(): void;
	//stop(): void;
}


export type IClientProps = {
	bridges: IBridge;
	channels: IChannel;
	endpoints: IEndpoints;
}

export type ClientConnection = {
	protocol: string;
	host: string;
	hostname: string;
	prefix: string;
	user: string;
	pass: string;
}

export interface ISwaggerErrorFormated {
	response: {
		status: number;
		headers: object;
		data: string;
		body: object;
	}
}
