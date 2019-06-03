import { RouteStatus, RouteStatusSlug } from "app/model/entities/route";
import { SortingDirection, SortingDirectionSlug } from "app/model/entities/shared";
import { DateTime } from "luxon";
import { OrderStatusSlug, OrderStatus } from "app/model/entities/order";

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
    return SortingDirection.map[direction].value;
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
        case "stops": return 5;
        default: throw new Error("Unexpected sort property.");
    }
}

export function getLegacyRouteStatus(status: RouteStatusSlug): number
{
    return RouteStatus.map[status].value;
}

export function getLegacyOrderSortProperty(property: string): number
{
    switch (property)
    {
        case "slug": return 1;
        case "reference": return 2;
        case "status": return 6;
        case "start-date": return 4;
        case "start-address": return 3;
        case "stops": return 5;
        default: throw new Error("Unexpected sort property.");
    }
}

export function getLegacyOrderStatus(status: OrderStatusSlug): number
{
    return OrderStatus.map[status].value;
}
