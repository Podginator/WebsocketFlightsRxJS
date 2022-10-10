import { map, Observable, scan, withLatestFrom, firstValueFrom } from 'rxjs';
import { getFlightMap, getFlightUpdateObserver } from './lib/flights';
import { getPrintObserver, createArrivalInformationFromFlightMap } from './lib/printer';
import { getWebsocketObserver } from './lib/websocket';
import { FlightNumberToFlightMap, FlightUpdate } from './types/flights';
import { WebsocketMessage } from './types/websockets';

/**
 * Update the flightMap, this is used in a scan, therefore the initial value for the flightAccumulator 
 * value is the seed from scan function. 
 * 
 * @param flightAccumulator Initially the daily flight map 
 * @param update An update, which is also a partial of the entries for the flightMap
 * @returns An updated flight map. 
 */
const updateFlightMap = (flightAccumulator : FlightNumberToFlightMap, update : FlightUpdate) => { 
    const id = update.flightNumber; 

    // Update the flight map (if it's present already)
    const currentFlightInformation = flightAccumulator[id];
    if (currentFlightInformation) { 
        flightAccumulator[id] =  { ...currentFlightInformation, ...update };
    }

    return flightAccumulator;
};

/**
 * Listens for the flight update messages, and pipes them through a scan function that continually updates
 * the provided seed value 
 * @param websocketObserver The Websocket Observer we are using to get the messages. 
 * @param seedFlightMap The seed value we provide, and later the accumulator for the scan operation
 * @returns An Observer of updated flight values. 
 */
const createUpdatingFlightUpdateObserver = (websocketObserver: Observable<WebsocketMessage>, seedFlightMap: FlightNumberToFlightMap) => {
    return getFlightUpdateObserver(websocketObserver)
        .pipe(
            scan(updateFlightMap, seedFlightMap),   
        )
};

/**
 * The observer that prints any timing values. 
 * @param websocketObserver The Websocket we receive messages from. 
 * @param updatedFlights The updated flight map. 
 * @returns An observer that returns an ArrivalInfo to print.
 */
const createPrintObserver = (websocketObserver: Observable<WebsocketMessage>, updatedFlights: Observable<FlightNumberToFlightMap>) => { 
    return getPrintObserver(websocketObserver)
    .pipe(
        withLatestFrom(updatedFlights),
        map(([_, latest]) => createArrivalInformationFromFlightMap(latest))
    );
}
    
// Main
(async () => { 
    const flightMap : FlightNumberToFlightMap = await firstValueFrom(getFlightMap());
    const websocketObserver : Observable<WebsocketMessage> = getWebsocketObserver();

    const latestFlightUpdate = createUpdatingFlightUpdateObserver(websocketObserver, flightMap);
    const printWhenPromptedObserver = createPrintObserver(websocketObserver, latestFlightUpdate);

    printWhenPromptedObserver
        .subscribe(console.log);
})();


