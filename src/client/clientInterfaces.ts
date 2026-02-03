import { IEndpoints } from "./properties/endpoint";


export interface IClient {
	_attachApi(): Promise<void>
}


export type IClientProps = {
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
