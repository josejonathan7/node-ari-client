import events from "node:events";
import { ClientConnection, IClient, IClientProps } from "./clientInterfaces";

export class Client extends events.EventEmitter implements IClient {
	readonly bridges: IClientProps["bridges"];
	readonly channels: IClientProps["channels"];
	readonly endpoints: IClientProps["endpoints"];
	private readonly connection: ClientConnection;
	private readonly ariUrl: string;
	private readonly credentials: string;
	//private ws: WebSocket;

	constructor(baseURL: string, user: string, password: string, props: IClientProps) {
		super();
		this.endpoints = props.endpoints;
		this.bridges = props.bridges;
		this.channels = props.channels;
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

	// start(apps: string | string[], subscribeAll: string | null, callback?: string) {
	// 	// are we currently processing a WebSocket error?
	// 	this.processingError = false;

	// 	// Perform argument renaming for backwards compatibility
	// 	if (typeof subscribeAll === "function") {
	// 		callback = subscribeAll;
	// 		subscribeAll = null;
	// 	}

	// 	return new Promise((resolve, reject) => {
	// 		const applications = Array.isArray(apps) ? apps.join(",") : apps;
	// 		const protocol = this.connection.protocol === "https:" ? "wss" : "ws";
	//   		let wsUrl = `${protocol}://${this.connection.host}${this.connection.prefix}/ari/events?app=${applications}&api_key=${encodeURIComponent(this.connection.user)}:${encodeURIComponent(this.connection.pass)}`;

	// 		if (subscribeAll) {
	// 			wsUrl += "&subscribeAll=true";
	// 		}

	// 		this.retry = backoff.create({
	// 			delay: 100
	// 		});

	// 		connect();

	// 		 const connect = () => {
	// 			this.ws = new WebSocket(wsUrl);

	// 			this.ws.on("open", () => {
	// 				processOpen();

	// 			});
	// 			this.ws.on("error", processError);
	// 			this.ws.on("message", processMessage);
	// 			this.ws.on("pong", processPong);
	// 			this.ws.on("close", processClose);
	// 		};
	// 	});

	// }

	// ping(): void {
	// 	if (this._ws === undefined || this._wsClosed) {
	// 		return;
	// 	}
	// 	this._ws.ping();
	// }

	// stop(): void {
	// 	this._ws.close();
	// 	this._wsClosed = true;
	// }

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
