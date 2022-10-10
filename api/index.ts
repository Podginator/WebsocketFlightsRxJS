import express from 'express';
import wsMiddleware from 'express-ws';
import { MessageType, WebsocketPrint, WebsocketUpdate } from '../src/types/websockets';
import { arrivals, departures, flightUpdates } from './flightConstants';

const app = wsMiddleware(express()).app;


app.get('/arrivals', (_, res) => {
    res.json(arrivals);
});

app.get('/departures', (_, res) => {
    res.json(departures);
});


app.ws('/updates', async (ws, req) => { 
    for (const flightUpdate of flightUpdates) {
        console.log(flightUpdate);
        // 10% chance of printing per message.
        if (Math.random() > 0.9) { 
            ws.send(JSON.stringify({ type: MessageType.PRINT, payload: 'ArrivalPrint' } as WebsocketPrint));
        }
        ws.send(JSON.stringify({ type: MessageType.UPDATE, payload: flightUpdate } as WebsocketUpdate));
        await new Promise(resolve => setTimeout(resolve, 500 * Math.random()));
    }

    ws.send(JSON.stringify({ type: MessageType.PRINT, payload: 'ArrivalPrint' } as WebsocketPrint));
    ws.close();
});


app.listen(3000, () => {
    console.log('WS Server on port 3000!');
});