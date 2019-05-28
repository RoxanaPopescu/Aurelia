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
        this.apiClient = apiClient;
    }

    private readonly apiClient: ApiClient;

    /**
     * Determines whether the specified route exists.
     * @param routeSlug The slug for the route whose existence should be determined.
     * @returns A promise that will be resolved with a boolean indicating whether the route exists.
     */
    public async exists(routeSlug: string): Promise<boolean>
    {
        const result = await this.apiClient.head(`routes/${routeSlug}`,
        {
            optional: true
        });

        return result.response.ok;
    }

    /**
     * Creates a new route.
     * @param routeSlug The slug identifying the new route.
     * @param routeName The name of the new route.
     * @returns A promise that will be resolved with the new route.
     */
    public async create(route: RouteInfo): Promise<Route>
    {
        const result = await this.apiClient.post("routes",
        {
            body: { route }
        });

        return new Route(result.data);
    }

    /**
     * Gets all routes associatd with the current user.
     * @returns A promise that will be resolved with info about the routes.
     */
    public async getAll(sortProperty: string, sortDirection: SortDirection, page: number, pageSize: number, statusFilter?: RouteStatusSlug, textFilter?: string): Promise<{ routes: RouteInfo[]; routeCount: number }>
    {
        const result = await this.apiClient.post("routes/list",
        {
            body:
            {
                page,
                pageSize,
                sorting: [{ field: getLegacyRouteSortProperty(sortProperty), direction: getLegacySortDirection(sortDirection) }],
                status: statusFilter ? [getLegacyRouteStatus(statusFilter)] : [],
                filter: textFilter ? [textFilter] : []
            }
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
        const result = await this.apiClient.get(`routes/${routeSlug}`);

        return new Route(result.data);
    }

    /**
     * Saves the changes made to the specified route.
     * @param route The route to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async save(route: RouteInfo): Promise<void>
    {
        await this.apiClient.put(`routes/${route.slug}`,
        {
            body: route
        });
    }

    /**
     * Deletes the specified route.
     * @param routeSlug The slug identifying the route.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(routeSlug: string): Promise<void>
    {
        await this.apiClient.delete(`routes/${routeSlug}`);
    }
}
