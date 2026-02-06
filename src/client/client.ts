/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";
import { ClientConnection, IClient, IClientProps } from "./clientInterfaces";
import WebSocket from "ws";
import { backOf } from "./websocket/websocket";
import { Resources } from "../interfaces/events";
import { eventsRegistred } from "../interfaces/socketEventsResponse";

export class Client extends EventEmitter implements IClient {
	readonly bridges: IClientProps["bridges"];
	readonly channels: IClientProps["channels"];
	readonly endpoints: IClientProps["endpoints"];
	processingError = false;
	private wsClosed = false;
	private readonly connection: ClientConnection;
	private readonly ariUrl: string;
	private readonly credentials: string;
	retry: (fn: () => void) => boolean;
	private wsUrl?: string;
	private ws?: WebSocket;
	private instanceListeners: any[];

	constructor(baseURL: string, user: string, password: string, props: IClientProps) {
		super();
		this.endpoints = props.endpoints;
		this.bridges = props.bridges;
		this.channels = props.channels;
		this.retry = backOf({
			delay: 100
		});
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
		this.instanceListeners = [];
	}

	on<K extends keyof Resources>(eventName: K, listener: Resources[K]): this {
		return super.on(eventName, listener);
	}

	// emit<K extends keyof Resources>(eventName: K, ...args: Resources[K]): boolean {
	// 	return super.emit(eventName, ...args);
	// }

	async start(apps: string | string[], subscribeAll: string | null) {
		// are we currently processing a WebSocket error?
		this.processingError = false;

		const applications = Array.isArray(apps) ? apps.join(",") : apps;

		const protocol = this.connection.protocol === "https:" ? "wss" : "ws";
		this.wsUrl = `${protocol}://${this.connection.host}${this.connection.prefix}/ari/events?app=${applications}&api_key=${encodeURIComponent(this.connection.user)}:${encodeURIComponent(this.connection.pass)}`;

		if (subscribeAll) {
			this.wsUrl += "&subscribeAll=true";
		}

		return this.connectWebSocket();

	}

	private reconnect(error?: any) {
		const schedule = this.retry(this.connectWebSocket);
		const message = error ? error.message : "unknow";

		if (!schedule) {
			this.emit("WebSocketMaxRetries", error);

			return new Error("Connection attempts exceeded retries. " + message);
		} else {
			this.emit("WebSocketReconnecting", error);
		}
	};

	private async connectWebSocket() {
		if (!this.wsUrl) {
			this.emit("APILoadError", new Error("uri websocket não passada devidamente"));
			return;
		}

		this.ws = new WebSocket(this.wsUrl);

		this.ws.on("open", () => {
			this.processingError = false;

			//* reiniciando o contador de backof
			this.retry = backOf({
				delay: 100
			});

			this.emit("WebSocketConnected");
			console.log("conexão via websocket inciada");

			return;
		});

		this.ws.on("pong", () => {
			this.emit("pong");
		});

		this.ws.on("error", (error) => {
			if (this.wsClosed) {
				return;
			}

			this.processingError = true;

			this.reconnect(error);
		});

		this.ws.on("close", () => {
			if (this.wsClosed) {
				this.wsClosed = false;
			}

			if (!this.processingError) {
				this.reconnect();
			}
		});

		this.ws.on("message", (message: Buffer)=> {
			const buffer = Buffer.from(message);
			const jsonData = JSON.parse(buffer.toString("utf-8"));

			if (!eventsRegistred.includes(jsonData.type)) {
				console.log("novo evento com tipagem ainda não registrada: ", jsonData);
			}

			this.emit(jsonData.type, jsonData);
		});
	}

	// ping(): void {
	// 	if (this._ws === undefined || this._wsClosed) {
	// 		return;
	// 	}
	// 	this._ws.ping();
	// }

	stop(): void {
		if (this.ws) {
			this.ws.close();
			this.wsClosed = true;
		}
		console.log("conexão com webSocket encerrada");
	}
}
