import { HangUpEnum } from "../channelInterfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHangUpEnum(value: any): value is HangUpEnum {
	return Object.values(HangUpEnum).includes(value as HangUpEnum);
}
