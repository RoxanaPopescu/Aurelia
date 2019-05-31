import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RouteInfo } from "../../entities/route/list";
import { Route } from "../../entities/route/details";
import { RouteStatusSlug } from "../../entities/route";
import { getLegacyRouteSortProperty, getLegacySortDirection, getLegacyRouteStatus } from "legacy/helpers/api-helper";

/**
 * Represents a service that manages routes.
 */
@autoinject
export class RouteService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Gets all routes associatd with the current user.
     * @param statusFilter The route status to filter by, or undefined to apply no status filter.
     * @param textFilter The route text to filter by, or undefined to apply no text filter.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getAll(statusFilter?: RouteStatusSlug, textFilter?: string, sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ routes: RouteInfo[]; routeCount: number }>
    {
        const result = await this._apiClient.post("routes/list",
        {
            body:
            {
                page: paging ? paging.page : undefined,
                pageSize: paging ? paging.pageSize : undefined,
                sorting: sorting ? [{ field: getLegacyRouteSortProperty(sorting.property), direction: getLegacySortDirection(sorting.direction) }] : [],
                status: statusFilter ? [getLegacyRouteStatus(statusFilter)] : [],
                filter: textFilter ? [textFilter] : []
            },
            signal
        });

        return {
            routes: result.data.routes.map((data: any) => new RouteInfo(data)),
            routeCount: result.data.totalCount
        };
    }

    /**
     * Gets the specified route.
     * @param routeSlug The slug identifying the route.
     * @returns A promise that will be resolved with the route.
     */
    public async get(routeSlug: string): Promise<Route>
    {
        const result = await this._apiClient.get("routes/details",
        {
            query: { routeSlug }
        });

        return new Route(result.data);
    }
}
