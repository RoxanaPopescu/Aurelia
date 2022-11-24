import { DateTime } from "luxon";
import { autoinject } from "aurelia-framework";
import { IPaging, ISorting } from "shared/types";
import { ApiClient } from "shared/infrastructure";
import { Uuid } from "shared/utilities/id/uuid";
import { getLegacyRouteSortProperty, getLegacySortDirection } from "legacy/helpers/api-helper";
import { Position } from "app/model/shared";
import { OrderInfo } from "app/model/order";
import { Collo, ColloStatus, ColloStatusSlug } from "app/model/collo";
import { VehicleType } from "app/model/vehicle";
import { RouteStatusSlug, RouteStatus } from "../entities/route-status";
import { RouteInfo } from "../entities/route-info";
import { Route } from "../entities/route";
import { RouteStopStatusSlug, RouteStopStatus } from "../entities/route-stop-status";
import { RouteStop } from "../entities/route-stop";

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
     * @param filter The filter for finding routes
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getAll(
        filter?:
        {
            statuses?: RouteStatusSlug[];
            searchQuery?: string;
            tagsAllMatching?: string[];
            tagsOneMatching?: string[];
            startTimeFrom?: DateTime;
            startTimeTo?: DateTime;
            createdTimeFrom?: DateTime;
            createdTimeTo?: DateTime;
            assignedDriver?: boolean;
            assignedVehicle?: boolean;
            pickupNearby?: { position: Position; precision?: number };
            teams?: string[];
            orderedVehicleTypes?: string[];
            legacyOwnerIds?: string[];
        },
        include?:
        {
            owner?: boolean;
            fulfiller?: boolean;
            vehicle?: boolean;
            driver?: boolean;
            driverPosition?: boolean;
            tags?: boolean;
            criticality?: boolean;
            estimates?: boolean;
            delayedStops?: boolean;
            stops?: boolean;
            colli?: boolean;
        },
        sorting?: ISorting,
        paging?: IPaging,
        signal?: AbortSignal
    ): Promise<{ routes: RouteInfo[]; routeCount: number }>
    {
        const result = await this._apiClient.post("routes/list",
        {
            body:
            {
                page: paging ? paging.page : undefined,
                pageSize: paging ? paging.pageSize : undefined,
                sorting: sorting ?
                {
                    field: getLegacyRouteSortProperty(sorting.property),
                    direction: getLegacySortDirection(sorting.direction)
                } : undefined,
                statuses: filter?.statuses?.map(v => new RouteStatus(v).value),
                searchQuery: filter?.searchQuery,
                startTimeFrom: filter?.startTimeFrom,
                startTimeTo: filter?.startTimeTo,
                createdTimeFrom: filter?.createdTimeFrom,
                createdTimeTo: filter?.createdTimeTo,
                assignedDriver: filter?.assignedDriver,
                assignedVehicle: filter?.assignedVehicle,
                tagsAllMatching: filter?.tagsAllMatching,
                tagsOneMatching: filter?.tagsOneMatching,
                include: include ? include : {},
                pickupNearby: filter?.pickupNearby,
                teams: filter?.teams,
                orderedVehicleTypes: filter?.orderedVehicleTypes,
                legacyOwnerIds: filter?.legacyOwnerIds
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
     * @param slug The slug identifying the route.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route.
     */
    public async get(slug: string, signal?: AbortSignal): Promise<Route>
    {
        const result = await this._apiClient.get("routes/details",
        {
            query:
            {
                slug
            },
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
    public async setRouteStatus(route: Route, statusSlug: RouteStatusSlug): Promise<void>
    {
        await this._apiClient.post("routes/update-status",
        {
            body:
            {
                routeId: route.id,
                status: statusSlug
            }
        });

        route.status = new RouteStatus(statusSlug);
    }

    /**
     * Gets the recorded driver positions associated with the specified route.
     * @param route The route for which to get driver positions.
     * @returns A promise that will be resolved with the driver positions.
     */
    public async getDriverPositions(route: Route): Promise<Position[]>
    {
        const result = await this._apiClient.post("routes/driver-positions",
        {
            body:
            {
                routeId: route.id
            }
        });

        return result.data.results.map(p => new Position(p));
    }

    /**
     * Updates the specified route route.
     * @param route The route to update.
     */
    public async updateRoute(route: Route): Promise<void>
    {
        await this._apiClient.post("routes/update",
        {
            body:
            {
                routeId: route.id,
                route: route.toJSON()
            }
        });
    }

    /**
     * Removes the current driver from the specified route.
     * @param route The route from which the driver should be removed.
     */
    public async removeDriver(route: Route): Promise<void>
    {
        await this._apiClient.post("routes/remove-driver",
        {
            body:
            {
                routeSlug: route.slug,
                routeId: route.id
            }
        });
    }

    /**
     * Associate an the specified route with the specified order.
     * @param route The route.
     * @param orderSlug The slug identifying the order to associate with the route.
     */
    public async addOrders(
        route: Route,
        orders: OrderInfo[],
        stopInformation: { newPickupStops: boolean; newDeliveryStops: boolean; pickupStop: RouteStop | undefined; deliveryStop: RouteStop | undefined }
    ): Promise<void>
    {
        await this._apiClient.post("routes/orders/add",
        {
            body:
            {
                orderIds: orders.map(o => o.id),
                routeId: route.id,
                pickup: {
                    addOrdersAsNewStops: stopInformation.newPickupStops,
                    stopId: stopInformation.pickupStop?.id
                },
                delivery: {
                    addOrdersAsNewStops: stopInformation.newDeliveryStops,
                    stopId: stopInformation.deliveryStop?.id
                }
            }
        });
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
        await this._apiClient.post("routes/stops/add",
        {
            body: { routeId: route.id, stop, atIndex }
        });
    }

    /**
     * Creates a route based on the specified orders.
     * @param orders The orders from which the route is created from.
     * @param routeReference The reference for the route being created.
     * @param vehicleType The type of vehicle used for the route being created.
     * @returns A promise that will be resolved with the slug identifying the new route.
     */
    public async createRoute(orderIds: string[], routeReference: string, vehicleType: VehicleType): Promise<string>
    {
        const result = await this._apiClient.post("routes/create/from-orders",
        {
            body: { orderIds: orderIds, routeReference: routeReference, vehicleTypeId: vehicleType.id }
        });

        return result.data.slug;
    }

    /**
     * Creates collection points based on the specified orders.
     * @param orders The orders from which the route is created from.
     * @param route The route specific parameters.
     * @returns A promise that will be resolved with the slug identifying the new route.
     */
    public async createCollectionPoints(orderIds: string[], route:
    {
        startDateTime: DateTime;
        vehicleType: VehicleType;
        pickupGate?: string;
        reference?: string;
    }): Promise<{ slug: string; collectionPointIds: string[] }>
    {
        const result = await this._apiClient.post("routes/create/collection-points-from-orders",
        {
            body: {
                orderIds: orderIds,
                startDateTime: route.startDateTime,
                vehicleTypeId: route.vehicleType.id,
                routeReference: route.reference,
                pickupGate: route.pickupGate,
                jobId: Uuid.v4()
            }
        });

        return result.data;
    }

    /**
     * Saves the specified route stop.
     * @param route The route owning the stop.
     * @param stop The route stop to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveRouteStop(route: Route, stop: RouteStop): Promise<void>
    {
        await this._apiClient.post("routes/stops/update",
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

        await this._apiClient.post("routes/stops/move",
        {
            body: { routeId: route.id, stopId: stop.id, newIndex }
        });
    }

    /**
     * Starts the service on the stop.
     * @param stop The route stop to start the service on.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async startServiceTask(stop: RouteStop): Promise<void>
    {
        await this._apiClient.post("routes/stops/start-service",
        {
            body: { stopId: Number(stop.id) }
        });
    }

    /**
     * Adds a support note to the route.
     * @param note The support note for the route.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async addSupportNote(route: Route, note: string): Promise<void>
    {
        await this._apiClient.post("routes/add-support-note",
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
        await this._apiClient.post("routes/reload-driver-app",
        {
            body: { routeId: route.id }
        });
    }
}
