import { Client } from "./client/client";
import { Endpoint } from "./client/properties/endpoint";

export function connect(baseURL: string, user: string, password: string) {
	const client = new Client(baseURL, user, password, {
		endpoints: new Endpoint()
	});
	client.setMaxListeners(0);

	client.endpoints.get();

	return client._attachApi();
}
