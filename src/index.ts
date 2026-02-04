import { Client } from "./client/client";
import { Bridge } from "./client/properties/bridges/bridge";
import { Endpoint } from "./client/properties/endpoints/endpoint";
import { mountSwaggerPromise } from "./utils/mountSwaggerPromise";

export async function connect(baseURL: string, user: string, password: string) {

	const parsedUrl = new URL(baseURL);
	const connection = {
		protocol: parsedUrl.protocol,
		host: parsedUrl.host,
		hostname: parsedUrl.hostname,
		// support optional path prefix in asterisk http.conf
		prefix: parsedUrl.pathname === "/" ? "" : parsedUrl.pathname,
		user: user,
		pass: password
	};

	const ariUrl = `${connection.protocol}//${connection.host}${connection.prefix}/ari/api-docs/resources.json`;
	const credentials =btoa(`${connection.user}:${connection.pass}`);

	const client = new Client(baseURL, user, password, {
		bridges: new Bridge({
			ariUrl,
			credentials,
			mountSwaggerPromise
		}),
		endpoints: new Endpoint({
			ariUrl,
			credentials,
			mountSwaggerPromise
		})
	});

	client.setMaxListeners(0);


	return client;
}

