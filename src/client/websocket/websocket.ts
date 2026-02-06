import { ClientConnection } from "../clientInterfaces";
import WS from "ws";


// export class WebSocket {
// 	private readonly connection: ClientConnection;
// 	processingError = false;
// 	private ws: WS;

// 	constructor(baseURL: string, user: string, password: string) {

// 		const parsedUrl = new URL(baseURL);
// 		this.connection= {
// 			protocol: parsedUrl.protocol,
// 			host: parsedUrl.host,
// 			hostname: parsedUrl.hostname,
// 			// support optional path prefix in asterisk http.conf
// 			prefix: parsedUrl.pathname === "/" ? "" : parsedUrl.pathname,
// 			user: user,
// 			pass: password
// 		};
// 	}

// 	async connect(apps: string | string[], subscribeAll?: string) {

// 		const applications = Array.isArray(apps) ? apps.join(",") : apps;

// 		const protocol = this.connection.protocol === "https:" ? "wss" : "ws";
// 	  		let wsUrl = `${protocol}://${this.connection.host}${this.connection.prefix}/ari/events?app=${applications}&api_key=${encodeURIComponent(this.connection.user)}:${encodeURIComponent(this.connection.pass)}`;

// 		if (subscribeAll) {
// 			wsUrl += "&subscribeAll=true";
// 		}

// 		let retry = backOf({
// 			delay: 100
// 		});

// 		this.ws = new WS(wsUrl);
// 		this.ws.on("open", () => {
// 			this.processingError = false;

// 			//* reiniciando o contador de backof
// 			retry = backOf({
// 				delay: 100
// 			});


// 		});



// 	}
// }

interface IBackOf {
	delay: number;
	maxDelay?: number;
	maxRetries?: number;
}

export function backOf(data: IBackOf) {
	let delay = data.delay;
	const maxDelay = data.maxDelay ?? 10000;
	const maxRetries = data.maxRetries ?? 10;
	let retries = 0;

	return function (fn: () => void) {
		retries += 1;

		if (retries >= maxRetries) {
			return false;
		}

		setTimeout(fn, data.delay);

		delay = Math.min(delay * 2, maxDelay);

		return true;
	};
}
