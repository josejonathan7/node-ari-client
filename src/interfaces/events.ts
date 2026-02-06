import { BridgeCreated, BridgeDestroyed, BridgeVideoSourceChanged, ChannelConnectedLine, ChannelCreated, ChannelDestroyed, ChannelDialplan, ChannelEnteredBridge, ChannelHangupRequest, ChannelHold, ChannelLeftBridge, ChannelStateChange, ChannelUnhold, ChannelVarset, ContactStatusChange, DeviceStateChanged, PeerStatusChange, StasisEnd, StasisStart } from "./socketEventsResponse";

export type WebSocketConnectedEventType = "WebSocketConnected";
export type WebSocketReconnectingEventType = "WebSocketReconnecting";
export type WebSocketMaxRetriesEventType = "WebSocketMaxRetries";
export type PongEventType = "pong";
export type APILoadErrorEventType = "APILoadError";
export type EventsEventType = "Events";
export type MessageEventType = "Message";
export type MissingParamsEventType = "MissingParams";
export type EventEventType = "Event";
export type ContactInfoEventType = "ContactInfo";
export type PeerEventType = "Peer";
export type DeviceStateChangedEventType = "DeviceStateChanged";
export type PlaybackStartedEventType = "PlaybackStarted";
export type PlaybackContinuingEventType = "PlaybackContinuing";
export type PlaybackFinishedEventType = "PlaybackFinished";
export type RecordingStartedEventType = "RecordingStarted";
export type RecordingFinishedEventType = "RecordingFinished";
export type RecordingFailedEventType = "RecordingFailed";
export type ApplicationMoveFailedEventType = "ApplicationMoveFailed";
export type ApplicationReplacedEventType = "ApplicationReplaced";
export type BridgeCreatedEventType = "BridgeCreated";
export type BridgeDestroyedEventType = "BridgeDestroyed";
export type BridgeMergedEventType = "BridgeMerged";
export type BridgeVideoSourceChangedEventType = "BridgeVideoSourceChanged";
export type BridgeBlindTransferEventType = "BridgeBlindTransfer";
export type BridgeAttendedTransferEventType = "BridgeAttendedTransfer";
export type ChannelCreatedEventType = "ChannelCreated";
export type ChannelDestroyedEventType = "ChannelDestroyed";
export type ChannelEnteredBridgeEventType = "ChannelEnteredBridge";
export type ChannelLeftBridgeEventType = "ChannelLeftBridge";
export type ChannelStateChangeEventType = "ChannelStateChange";
export type ChannelDtmfReceivedEventType = "ChannelDtmfReceived";
export type ChannelDialplanEventType = "ChannelDialplan";
export type ChannelCallerIdEventType = "ChannelCallerId";
export type ChannelUsereventEventType = "ChannelUserevent";
export type ChannelHangupRequestEventType = "ChannelHangupRequest";
export type ChannelVarsetEventType = "ChannelVarset";
export type ChannelHoldEventType = "ChannelHold";
export type ChannelUnholdEventType = "ChannelUnhold";
export type ChannelTalkingStartedEventType = "ChannelTalkingStarted";
export type ChannelTalkingFinishedEventType = "ChannelTalkingFinished";
export type ContactStatusChangeEventType = "ContactStatusChange";
export type PeerStatusChangeEventType = "PeerStatusChange";
export type EndpointStateChangeEventType = "EndpointStateChange";
export type DialEventType = "Dial";
export type StasisEndEventType = "StasisEnd";
export type StasisStartEventType = "StasisStart";
export type TextMessageReceivedEventType = "TextMessageReceived";
export type ChannelConnectedLineEventType = "ChannelConnectedLine";
export type AnyEventType =
    | WebSocketConnectedEventType
    | WebSocketReconnectingEventType
    | WebSocketMaxRetriesEventType
    | PongEventType
    | APILoadErrorEventType
    | EventsEventType
    | MessageEventType
    | MissingParamsEventType
    | EventEventType
    | ContactInfoEventType
    | PeerEventType
    | DeviceStateChangedEventType
    | PlaybackStartedEventType
    | PlaybackContinuingEventType
    | PlaybackFinishedEventType
    | RecordingStartedEventType
    | RecordingFinishedEventType
    | RecordingFailedEventType
    | ApplicationMoveFailedEventType
    | ApplicationReplacedEventType
    | BridgeCreatedEventType
    | BridgeDestroyedEventType
    | BridgeMergedEventType
    | BridgeVideoSourceChangedEventType
    | BridgeBlindTransferEventType
    | BridgeAttendedTransferEventType
    | ChannelCreatedEventType
    | ChannelDestroyedEventType
    | ChannelEnteredBridgeEventType
    | ChannelLeftBridgeEventType
    | ChannelStateChangeEventType
    | ChannelDtmfReceivedEventType
    | ChannelDialplanEventType
    | ChannelCallerIdEventType
    | ChannelUsereventEventType
    | ChannelHangupRequestEventType
    | ChannelVarsetEventType
    | ChannelHoldEventType
    | ChannelUnholdEventType
    | ChannelTalkingStartedEventType
    | ChannelTalkingFinishedEventType
    | ContactStatusChangeEventType
    | PeerStatusChangeEventType
    | EndpointStateChangeEventType
    | DialEventType
    | StasisEndEventType
    | StasisStartEventType
    | TextMessageReceivedEventType
    | ChannelConnectedLineEventType;

export interface Resources {
	"WebSocketConnected": () => void;
	"WebSocketReconnecting": (error: Error) => void;
	"WebSocketMaxRetries": (error: Error) => void;
	"pong": () => void;
	"APILoadError": (error: Error) => void;
	"Events": () => void;
	"Message": () => void;
	"MissingParams": () => void;
	"Event": () => void;
	"ContactInfo": () => void;
	"Peer": () => void;
	"DeviceStateChanged": (event: DeviceStateChanged) => void;
	"PlaybackStarted": () => void;
	"PlaybackContinuing": () => void;
	"PlaybackFinished": () => void;
	"RecordingStarted": () => void;
	"RecordingFinished": () => void;
	"RecordingFailed": () => void;
	"ApplicationMoveFailed": () => void;
	"ApplicationReplaced": () => void;
	"BridgeCreated": (event: BridgeCreated) => void;
	"BridgeDestroyed": (event: BridgeDestroyed) => void;
	"BridgeMerged": () => void;
	"BridgeVideoSourceChanged": (event: BridgeVideoSourceChanged) => void;
	"BridgeBlindTransfer": () => void;
	"BridgeAttendedTransfer": () => void;
	"ChannelCreated": (event: ChannelCreated) => void;
	"ChannelDestroyed": (event: ChannelDestroyed) => void;
	"ChannelEnteredBridge": (event: ChannelEnteredBridge) => void;
	"ChannelLeftBridge": (event: ChannelLeftBridge) => void;
	"ChannelStateChange": (event: ChannelStateChange) => void;
	"ChannelDtmfReceived": () => void;
	"ChannelDialplan": (event: ChannelDialplan) => void;
	"ChannelCallerId": () => void;
	"ChannelUserevent": () => void;
	"ChannelHangupRequest": (event: ChannelHangupRequest) => void;
	"ChannelVarset": (event: ChannelVarset) => void;
	"ChannelHold": (event: ChannelHold) => void;
	"ChannelUnhold": (event: ChannelUnhold) => void;
	"ChannelTalkingStarted": () => void;
	"ChannelTalkingFinished": () => void;
	"ContactStatusChange": (event: ContactStatusChange) => void;
	"PeerStatusChange": (event: PeerStatusChange) => void;
	"EndpointStateChange": () => void;
	"Dial": () => void;
	"StasisEnd": (event: StasisEnd) => void;
	"StasisStart": (event: StasisStart) => void;
	"TextMessageReceived": () => void;
	"ChannelConnectedLine": (event: ChannelConnectedLine) => void;
}
