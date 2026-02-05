import { Client } from "./client/client";
import { Bridge } from "./client/properties/bridges/bridge";
import { Channel } from "./client/properties/channels/channel";
import { isHangUpEnum } from "./client/properties/channels/utils/isHangUpEnum";
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

	const constructorProps = {
		ariUrl,
		credentials,
		mountSwaggerPromise
	};

	const client = new Client(baseURL, user, password, {
		bridges: new Bridge(constructorProps),
		channels: new Channel({
			...constructorProps,
			isHangUpEnum
		}),
		endpoints: new Endpoint(constructorProps)
	});

	client.setMaxListeners(0);

	return client;
}

