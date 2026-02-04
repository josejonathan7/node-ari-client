import events from "node:events";
import { ClientConnection, IClient, IClientProps } from "./clientInterfaces";

export class Client extends events.EventEmitter implements IClient {
	readonly endpoints: IClientProps["endpoints"];
	readonly bridges: IClientProps["bridges"];
	private readonly connection: ClientConnection;
	private readonly ariUrl: string;
	private readonly credentials: string;

	constructor(baseURL: string, user: string, password: string, props: IClientProps) {
		super();
		this.endpoints = props.endpoints;
		this.bridges = props.bridges;
		const parsedUrl = new URL(baseURL);

		this.connection = {
			protocol: parsedUrl.protocol,
			host: parsedUrl.host,
			hostname: parsedUrl.hostname,
			// support optional path prefix in asterisk http.conf
			prefix: parsedUrl.pathname === "/" ? "" : parsedUrl.pathname,
			user: user,
			pass: password
		};

		this.ariUrl = `${this.connection.protocol}//${this.connection.host}${this.connection.prefix}/ari/api-docs/resources.json`;
		this.credentials =btoa(`${this.connection.user}:${this.connection.pass}`);
	}

	async _attachApi() {
		const knownPropertyTypes = [
			"applications",
			"asterisk",
			"channels",
			"bridges",
			"deviceStates",
			"endpoints",
			"mailboxes",
			"playbacks",
			"sounds"
		];


		for (const knownType of knownPropertyTypes) {


			if (knownType === "endpoints") {

				continue;
			}

		}

	}

}
