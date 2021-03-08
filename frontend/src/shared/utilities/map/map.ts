/**
 * Rounds the birds eye distance between two gps points.
 * @param positionFrom The position to calculate from.
 * @param positionTo The position to calculate to.
 */
export function calculateDistance(positionFrom: any, positionTo: any): number
{
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((positionFrom.latitude-positionTo.latitude) * p) / 2 + c(positionTo.latitude * p) *c((positionFrom.latitude) * p) * (1 - c(((positionFrom.longitude- positionTo.longitude) * p))) / 2;
    const dis = (12742 * Math.asin(Math.sqrt(a)));
    return dis * 1000;
}
