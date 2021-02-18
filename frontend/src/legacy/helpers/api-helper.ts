import { DateTime } from "luxon";
import { SortingDirection, SortingDirectionSlug } from "app/model/shared";
import { RouteStatus, RouteStatusSlug } from "app/model/route";
import { OrderStatusSlug, OrderStatus } from "app/model/order";

export function parseDateTime(date: string, time?: string): DateTime
{
    let dateTime: string;

    if (time)
    {
        if (date.includes("T"))
        {
            dateTime = date.replace(/T[\d:.,]*/, `T${time}`);
        }
        else
        {
            dateTime = `${date}T${time}`;
        }
    }
    else
    {
        dateTime = date;
    }

    return DateTime.fromISO(dateTime, { setZone: true });
}

export function getLegacySortDirection(direction: SortingDirectionSlug): number
{
    return SortingDirection.values[direction].value;
}

export function getLegacyRouteSortProperty(property: string): number
{
    switch (property)
    {
        case "slug": return 1;
        case "reference": return 2;
        case "status": return 6;
        case "start-date": return 4;
        case "start-address": return 3;
        case "stop-count": return 5;
        default: throw new Error("Unexpected sort property.");
    }
}

export function getLegacyRouteStatus(status: RouteStatusSlug): number
{
    return RouteStatus.values[status].value;
}

export function getLegacyOrderSortProperty(property: string): number | undefined
{
    switch (property)
    {
        case "slug": return 1;
        case "pickup-date": return 6;
        case "pickup-time": return 7;
        case "pickup-address": return 4;
        case "delivery-date": return 14;
        case "delivery-time": return 15;
        case "delivery-address": return 12;
        case "status": return 20;
        case "colli-count": return 19;
        case "estimated-colli-count": return 18;
        default: throw new Error("Unexpected sort property.");
    }
}

export function getLegacyOrderStatus(status: OrderStatusSlug): number
{
    return OrderStatus.values[status].value;
}
