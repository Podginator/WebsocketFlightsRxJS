import { from, merge, Observable } from "rxjs";
import { reduce, filter, map, mergeMap } from "rxjs/operators";
import axios from 'axios';
import { Arrival, Departure, FlightNumberToFlightMap, Flight, FlightUpdate } from "../types/flights";
import { WebsocketMessage, MessageType } from "../types/websockets";

/**
 * @returns An Observer based on the returned value of Axios.
 */
const getArrivalsFromServer = () : Observable<Arrival> => { 
    return from(axios.get<Arrival[]>('http://localhost:3000/arrivals'))
            .pipe(
                mergeMap(({ data }) => data)
            );
}; 

/**
 * @returns An observer that returns the list of departed flights 
 */
const getDeparturesFromServer = () : Observable<Departure> => { 
    return from(axios.get<Departure[]>('http://localhost:3000/departures'))
        .pipe(
            mergeMap(({ data }) => data)
        )
};

/**
 * create a map from from Flight Number to Flight 
 * @param flightMap The accumulated flight Map 
 * @param currentFlight the flight to add to the map 
 */
const reduceFlightsToMap = (flightMap : FlightNumberToFlightMap , currentFlight : Flight) : FlightNumberToFlightMap => { 
    const flightNumber = currentFlight.flightNumber;

    // Check if the map already contains that flight, and if it does merge the values 
    const existingFlight = flightMap[flightNumber] || {};
    flightMap[flightNumber] =  { ...existingFlight, ...currentFlight };

    return flightMap;
};

/**
 * Uses the arrival and departure information to provide a flight map observable.
 */
export const getFlightMap = () : Observable<FlightNumberToFlightMap> => { 
    const arrivalPromise = getArrivalsFromServer();
    const departurePromise = getDeparturesFromServer();

    return merge(arrivalPromise, departurePromise)
            .pipe(
                reduce(reduceFlightsToMap, {}),
            );
        
};

/**
 * An Observable that filters on Flight Update messages 
 * 
 * @param websocketObserver The websocket observer 
 */
export const getFlightUpdateObserver = (websocketObserver : Observable<WebsocketMessage>) : Observable<FlightUpdate> => { 
    return websocketObserver.pipe( 
        filter(x => x.type === MessageType.UPDATE),
        map (x => x.payload as FlightUpdate)
    );
};