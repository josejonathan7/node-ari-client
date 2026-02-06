import { IBridgeBodyResponse } from "../client/properties/bridges/bridgeInterfaces";
import { IChannelBodyResponse } from "../client/properties/channels/channelInterfaces";
import { IEndpointBodyResponse } from "../client/properties/endpoints/endpointInterfaces";
import { Resources } from "./events";

export interface ISocketBasicPropertis {
  	type: keyof Resources;
  	timestamp: string;
	asterisk_id: string;
  	application: string;
}

export type ChannelCreated = ISocketBasicPropertis & {
	channel: IChannelBodyResponse;
}

export type ChannelVarset = ISocketBasicPropertis & {
  variable: string;
  value?: string;
  channel: IChannelBodyResponse;
}

export type ChannelDialplan = ISocketBasicPropertis & {
  dialplan_app: string;
  dialplan_app_data: string;
  channel: IChannelBodyResponse;
}

export type StasisStart = ISocketBasicPropertis & {
  args: [],
  channel: IChannelBodyResponse;
}

export type ChannelHangupRequest = ISocketBasicPropertis & {
  cause: number;
  soft?: boolean;
  tech_cause: number;
  channel: IChannelBodyResponse;
}

export type StasisEnd = ISocketBasicPropertis & {
  channel: IChannelBodyResponse;
}

export type ChannelDestroyed = ISocketBasicPropertis & {
  cause: number;
  cause_txt: string;
  tech_cause: number;
  channel: IChannelBodyResponse;
}

export type DeviceStateChanged = ISocketBasicPropertis & {
	device_state: {
		name: string;
		state: string;
	}
}

export type ChannelStateChange = ISocketBasicPropertis & {
	channel: IChannelBodyResponse;
}

export type ChannelLeftBridge = ISocketBasicPropertis & {
	bridge: IBridgeBodyResponse;
	channel: IChannelBodyResponse;
}

export type BridgeVideoSourceChanged = ISocketBasicPropertis & {
	bridge: IBridgeBodyResponse;
}

export type ChannelEnteredBridge = ISocketBasicPropertis & {
	bridge: IBridgeBodyResponse;
	channel: IChannelBodyResponse;
}

export type BridgeCreated = ISocketBasicPropertis & {
	bridge: IBridgeBodyResponse;
}

export type ContactStatusChange = ISocketBasicPropertis & {
	endpoint: IEndpointBodyResponse;
	contact_info: {
		uri: string;
		contact_status: string;
		aor: string;
		roundtrip_user: string;
	}
}

export type PeerStatusChange = ISocketBasicPropertis & {
	endpoint: IEndpointBodyResponse;
	peer: {
		peer_status: string;
	}
}

export type ChannelConnectedLine = ISocketBasicPropertis & {
	channel: IChannelBodyResponse;
}

export type ChannelHold = ISocketBasicPropertis & {
	channel: IChannelBodyResponse;
}

export type ChannelUnhold= ISocketBasicPropertis & {
	channel: IChannelBodyResponse;
}

export type BridgeDestroyed = ISocketBasicPropertis & {
	bridge: IBridgeBodyResponse;
}

export const eventsRegistred = [
	"ChannelCreated",
	"ChannelVarset",
	"ChannelDialplan",
	"StasisStart",
	"ChannelHangupRequest",
	"StasisEnd",
	"ChannelDestroyed",
	"DeviceStateChanged",
	"ChannelStateChange",
	"ChannelLeftBridge",
	"BridgeVideoSourceChanged",
	"ChannelEnteredBridge",
	"BridgeCreated",
	"ContactStatusChange",
	"PeerStatusChange",
	"ChannelConnectedLine",
	"ChannelHold",
	"ChannelUnhold",
	"BridgeDestroyed"
];
