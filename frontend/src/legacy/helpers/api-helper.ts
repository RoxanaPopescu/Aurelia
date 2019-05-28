import { SortDirection } from "shared/types";
import { RouteStatus, RouteStatusSlug } from "app/model/entities/route";
import { SortingDirection } from "app/model/entities/shared";

export function getLegacySortDirection(direction: SortDirection): number
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
