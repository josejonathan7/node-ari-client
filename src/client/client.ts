import events from "node:events";
import { ClientConnection, IClient, IClientProps } from "./clientInterfaces";

export class Client extends events.EventEmitter implements IClient {
	private readonly props: IClientProps;
	readonly endpoints: IClientProps["endpoints"];
	private readonly connection: ClientConnection;
	private readonly ariUrl: string;
	private readonly credentials: string;

	constructor(baseURL: string, user: string, password: string, props: IClientProps) {
		super();
		this.props = props;
		this.endpoints = props.endpoints;
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
				this.#mountEndpointProperty();

				continue;
			}

		}

	}

}
