import { FlightUpdate } from "./flights";

export enum MessageType {
    PRINT = 'PRINT',
    UPDATE = 'UPDATE',
}

export interface WebsocketType<Type extends MessageType, Payload> {
    type: Type;
    payload: Payload;
}

export type WebsocketPrint = WebsocketType<MessageType.PRINT, 'ArrivalPrint'>;
export type WebsocketUpdate = WebsocketType<MessageType.UPDATE, FlightUpdate>;

export type WebsocketMessage =
    | {
          type: MessageType.UPDATE;
          payload: FlightUpdate;
      }
    | {
          type: MessageType.PRINT;
          payload: ArrivalPrint;
      };


export type ArrivalPrint = 'ArrivalPrint'
