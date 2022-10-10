import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { mergeWith, pick, mapValues } from 'lodash';
import { ArrivalInformation, Flight, FlightDates, FlightNumberToFlightMap } from '../types/flights';
import { WebsocketMessage, ArrivalPrint, MessageType } from '../types/websockets';

export const EMPTY_ARRIVAL_INFO : ArrivalInformation = Object.freeze({ 
    lateArrivals: 0,
    earlyArrivals: 0,
    lateDepartures: 0,
    earlyDepartures: 0
});

const TIMES = ['arrivalTime', 'landingTime', 'departureTime', 'takeOffTime'] as const;

/**
 * provides an object of whether a flight is late or early 
 * 
 * @param flight The current flight that we're reducing 
 */
const getTimingInfo = (flight: Flight) : ArrivalInformation => { 
    const flightTimes = pick(flight, TIMES);
    const { arrivalTime, departureTime, landingTime, takeOffTime } = mapValues<FlightDates>(flightTimes, time => new Date(time))

    return { 
        lateArrivals: landingTime > arrivalTime ? 1 : 0, 
        earlyArrivals: landingTime < arrivalTime ? 1 : 0,
        lateDepartures: takeOffTime > departureTime ? 1 : 0,
        earlyDepartures: takeOffTime < departureTime ? 1 : 0
    };
};

/**
 * Reduces a map to an object in the Format ArrivalInformation
 * 
 * @param flightMap The Flight information map 
 */
export const createArrivalInformationFromFlightMap = (flightMap : FlightNumberToFlightMap): ArrivalInformation => { 
    return Object.values(flightMap)
            .reduce((arrivalInfo: ArrivalInformation, flight: Flight) => {
                const timingInfo : ArrivalInformation = getTimingInfo(flight);
                return mergeWith(timingInfo, arrivalInfo, (o1, o2) => o1 + o2);
            },
            EMPTY_ARRIVAL_INFO);
};

/**
 * An Observable that filters on Websocket Print messages 
 * 
 * @param websocketObserver The websocket observer 
 */
export const getPrintObserver = (websocketObserver : Observable<WebsocketMessage>) : Observable<ArrivalPrint> => { 
    return websocketObserver
        .pipe(
            filter(x => x.type === MessageType.PRINT),
            map (x => x.payload as ArrivalPrint)
        );
};