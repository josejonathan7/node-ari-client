import { EventEmitter } from "events";
import { Resources } from "../interfaces/events";
import { IBridge } from "./properties/bridges/bridgeInterfaces";
import { IEndpoints } from "./properties/endpoints/endpointInterfaces";
import { IChannel } from "./properties/channels/channelInterfaces";



export interface IClient extends EventEmitter {
	on<K extends keyof Resources>(event: K, listener: Resources[K]): this;
	//emit<K extends keyof Resources>(event: K, ...args: Resources[K]): boolean;
	//ping(): void;
	start(apps: string | string[], subscribeAll: string | null): void;
	stop(): void;
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
