import { Observable } from 'rxjs';
import { WebSocketSubjectConfig, webSocket } from 'rxjs/webSocket';
import { WebsocketMessage } from '../types/websockets';
import WebSocket from 'ws';

export const getWebsocketObserver = () : Observable<WebsocketMessage> => { 
    const WebSocketConstructor = WebSocket || require('ws');
    const clientOptions : WebSocketSubjectConfig<WebsocketMessage> = {
        protocol: 'v1',
        url: 'ws://localhost:3000/updates',
        WebSocketCtor: WebSocketConstructor,
      };

    return webSocket(clientOptions);
};