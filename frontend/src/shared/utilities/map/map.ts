/**
 * Rounds the birds eye distance between two gps points.
 * @param positionFrom The position to calculate from.
 * @param positionTo The position to calculate to.
 */
export function calculateDistance(positionFrom: any, positionTo: any): number
{
    const p = 0.017453292519943295;
    const a = 0.5 - Math.cos((positionFrom.latitude - positionTo.latitude) * p) / 2 + Math.cos(positionTo.latitude * p) * Math.cos((positionFrom.latitude) * p) * (1 - Math.cos(((positionFrom.longitude - positionTo.longitude) * p))) / 2;
    const distance = (Math.asin(Math.sqrt(a)) * 12742);

    return distance * 1000;
}
