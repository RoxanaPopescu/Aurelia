import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RouteInfo } from "../../entities/route/list";
import { Route } from "../../entities/route/details";
import { RouteStatusSlug } from "app/model/entities/route";
import { SortDirection } from "shared/types";
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
     * @param sortProperty The property by which the results should be sorted.
     * @paran sortDirection The direction in which the results should be sorted.
     * @paran page The page to get.
     * @paran pageSize The size of the pages.
     * @paran statusFilter The route status to filter by, or undefined to apply no status filter.
     * @paran textFilter The route text to filter by, or undefined to apply no text filter.
     * @paran signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getAll(
        sortProperty: string,
        sortDirection: SortDirection,
        page: number,
        pageSize: number,
        statusFilter?: RouteStatusSlug,
        textFilter?: string,
        signal?: AbortSignal): Promise<{ routes: RouteInfo[]; routeCount: number }>
    {
        const result = await this._apiClient.post("routes/list",
        {
            body:
            {
                page,
                pageSize,
                sorting: [{ field: getLegacyRouteSortProperty(sortProperty), direction: getLegacySortDirection(sortDirection) }],
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
