/**
 * @typedef {Object} FlightLeg
 * @property {string} id
 * @property {{
*   id: string,
*   from: { id: string, name: string },
*   to: { id: string, name: string },
*   distance: number
* }} routeInfo
* @property {{
*   id: string,
*   company: { id: string, name: string },
*   price: number,
*   flightStart: string,
*   flightEnd: string
* }[]} providers
*/
