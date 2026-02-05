
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
    // | WebSocketConnectedEventType
    // | WebSocketReconnectingEventType
    // | WebSocketMaxRetriesEventType
    // | PongEventType
    // | APILoadErrorEventType
    // | EventsEventType
    // | MessageEventType
    // | MissingParamsEventType
    // | EventEventType
    // | ContactInfoEventType
    // | PeerEventType
    // | DeviceStateChangedEventType
    // | PlaybackStartedEventType
    // | PlaybackContinuingEventType
    // | PlaybackFinishedEventType
    // | RecordingStartedEventType
    // | RecordingFinishedEventType
    // | RecordingFailedEventType
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
	"ApplicationMoveFailed": () => void;
	"ApplicationReplaced": () => void;
	"BridgeCreated": () => void;
	"BridgeDestroyed": () => void;
	"BridgeMerged": () => void;
	"BridgeVideoSourceChanged": () => void;
	"BridgeBlindTransfer": () => void;
	"BridgeAttendedTransfer": () => void;
	"ChannelCreated": () => void;
	"ChannelDestroyed": () => void;
	"ChannelEnteredBridge": () => void;
	"ChannelLeftBridge": () => void;
	"ChannelStateChange": () => void;
	"ChannelDtmfReceived": () => void;
	"ChannelDialplan": () => void;
	"ChannelCallerId": () => void;
	"ChannelUserevent": () => void;
	"ChannelHangupRequest": () => void;
	"ChannelVarset": () => void;
	"ChannelHold": () => void;
	"ChannelUnhold": () => void;
	"ChannelTalkingStarted": () => void;
	"ChannelTalkingFinished": () => void;
	"ContactStatusChange": () => void;
	"PeerStatusChange": () => void;
	"EndpointStateChange": () => void;
	"Dial": () => void;
	"StasisEnd": () => void;
	"StasisStart": (event: StasisStart, channel: any) => void;
	"TextMessageReceived": () => void;
	"ChannelConnectedLine": () => void;
}


export interface StasisStart extends Event {
    /**
     * Arguments to the application.
     */
    args: string | string[];

    /**
     * Channel.
     */
    channel: any;

    /**
     * Replace_channel.
     */
    replace_channel?: any | undefined;
}
