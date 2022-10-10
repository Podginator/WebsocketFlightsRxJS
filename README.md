# RXJS Flights

A brief demo application to show how to use RXJS with Websockets in order to create a realtime flight update map that prints values based on an incoming print message and updates when a new flight import is seen. 

## Technologies Used

* Express for Websockets (Fake API)
* RxJS 
* Websockets
* Typescript 
* Axios 

## Testing

An example server is provided. Run this with `npm run start-server` 
It will provide some flights, updates, and periodically will print the late messages. 