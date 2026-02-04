import { IBridge } from "./properties/bridges/bridgeInterfaces";
import { IEndpoints } from "./properties/endpoints/endpointInterfaces";



export interface IClient {
	_attachApi(): Promise<void>
}


export type IClientProps = {
	endpoints: IEndpoints;
	bridges: IBridge;
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
