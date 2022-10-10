export interface Departure {
    flightNumber: string;
    destination: string;
    departureTime: string;
    takeOffTime?: string;
    gate: string;
}

export interface DepartureUpdate {
    flightNumber: string;
    takeOffTime: string;
}


export interface Arrival {
    flightNumber: string;
    origin: string;
    arrivalTime: string;
    landingTime?: string;
    gate: string;
}

export interface ArrivalUpdate {
    flightNumber: string;
    landingTime: string;
}


export type Flight = Arrival | Departure;
export type FlightUpdate = ArrivalUpdate | DepartureUpdate;
export type FlightNumberToFlightMap = { [flightId: string] : Flight };
export type ArrivalInformation = { 
    lateArrivals: number,
    earlyArrivals: number,
    lateDepartures: number,
    earlyDepartures: number,
}

export type FlightDates = Record<keyof ArrivalInformation, Date>
