import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RouteStatusSlug, RouteStatus } from "../entities/route-status";
import { RouteInfo } from "../entities/route-info";
import { Route } from "../entities/route";
import { RouteStopStatusSlug, RouteStopStatus } from "../entities/route-stop-status";
import { RouteStop } from "../entities/route-stop";
import { Collo, ColloStatus, ColloStatusSlug } from "app/model/collo";
import { getLegacyRouteSortProperty, getLegacySortDirection, getLegacyRouteStatus } from "legacy/helpers/api-helper";
import { VehicleType } from "shared/src/model/session";

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
     * Gets all routes visible to the current user.
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
                status: statusFilter ? [getLegacyRouteStatus(statusFilter)] : undefined,
                filter: textFilter ? [textFilter] : undefined
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
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route.
     */
    public async get(routeSlug: string, signal?: AbortSignal): Promise<Route>
    {
        const result = await this._apiClient.get("routes/details",
        {
            query: { routeSlug },
            signal
        });

        return new Route(result.data);
    }

    /**
     * Changes the status of the specified route to the specified status.
     * @param route The route for which the status should be set.
     * @param routeStatusSlug The slug identifying the new status.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async setRouteStatus(route: Route, routeStatusSlug: RouteStatusSlug): Promise<void>
    {
        await this._apiClient.post("routes/setRouteStatus",
        {
            body:
            {
                routeId: route.id,
                status: routeStatusSlug
            }
        });

        route.status = new RouteStatus(routeStatusSlug);
    }

    /**
     * Adds the specified route stop at the specified index.
     * @param route The route owning the stop.
     * @param stop The route stop to add.
     * @param atIndex The index at which the stop should be inserted.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async addRouteStop(route: Route, stop: RouteStop, atIndex: number): Promise<void>
    {
        await this._apiClient.post("routes/stop/add",
        {
            body: { routeId: route.id, stop, atIndex }
        });
    }

    /**
     * Adds the specified route stop at the specified index.
     * @param orders The orders from which the route is created from.
     * @param routeReference The reference for the route being created.
     * @param vehicleType The type of vehicle used for the route being created.
     * @returns A promise that will be resolved with a route slug.
     */
    public async createRoute(orderIds: string[], routeReference: string, vehicleType: VehicleType): Promise<string>
    {
        let result = await this._apiClient.post("routes/create",
        {
            body: { orders: orderIds, routeReference: routeReference, vehicleTypeId: vehicleType.id }
        });

        return result.data.routeSlug;
    }

    /**
     * Saves the specified route stop.
     * @param route The route owning the stop.
     * @param stop The route stop to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveRouteStop(route: Route, stop: RouteStop): Promise<void>
    {
        await this._apiClient.post("routes/stop/update",
        {
            body: { routeId: route.id, stop }
        });
    }

    /**
     * Moves the specified route stop to the specified index.
     * @param route The route owning the stop.
     * @param stop The route stop to move.
     * @param newIndex The index to which the stop should be moved.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async moveRouteStop(route: Route, stop: RouteStop, newIndex: number): Promise<void>
    {
        const sourceIndex = route.stops.indexOf(stop);

        route.stops.splice(newIndex, 0, ...route.stops.splice(sourceIndex, 1));

        for (let i = 0; i < route.stops.length; i++)
        {
            route.stops[i].stopNumber = i + 1;
        }

        await this._apiClient.post("routes/stop/move",
        {
            body: { routeId: route.id, stopId: stop.id, newIndex }
        });
    }

    /**
     * Adds a support note to the route.
     * @param note The support note for the route.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async addSupportNote(route: Route, note: string): Promise<void>
    {
        await this._apiClient.post("routes/addSupportNote",
        {
            body: { routeId: route.id, note }
        });
    }

    /**
     * Changes the status of the specified route stop to the specified status.
     * @param route The route owning the stop.
     * @param stop The route stop for which the status should be set.
     * @param routeStopStatusSlug The slug identifying the new status.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async setRouteStopStatus(route: Route, stop: RouteStop, routeStopStatusSlug: RouteStopStatusSlug): Promise<void>
    {
        stop.status = new RouteStopStatus(routeStopStatusSlug);

        await this._apiClient.post("routes/stops/update",
        {
            body: { routeId: route.id, stop }
        });
    }

    /**
     * Changes the status of the specified collo to the specified status.
     * @param collo The collo for which the status should be set.
     * @param colloStatusSlug The slug identifying the new status.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async setColloStatus(collo: Collo, colloStatusSlug: ColloStatusSlug): Promise<void>
    {
        await this._apiClient.post("routes/setColloStatus",
        {
            body: { colloId: collo.id, status: colloStatusSlug }
        });

        collo.status = new ColloStatus(colloStatusSlug);
    }

    /**
     * Reloads the specified route in the driver app.
     * @param routeId The ID of the route to reload.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async reloadRoute(route: Route): Promise<void>
    {
        await this._apiClient.post("routes/reloadRouteInApp",
        {
            body: { routeId: route.id }
        });
    }
}
