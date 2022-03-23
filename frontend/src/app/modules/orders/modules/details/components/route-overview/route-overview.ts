import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { RouteService, Route, RouteStop } from "app/model/route";
import { Order } from "app/model/order";

/**
 * Represents the module.
 */
@autoinject
export class RouteOverview
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     */
    public constructor(routeService: RouteService)
    {
        this._routeService = routeService;
    }

    private pollTimeout: any;
    private readonly _routeService: RouteService;

    /**
     * The ID of the route.
     */
    @bindable
    protected id: string;

    /**
     * The ID of the order.
     */
    @bindable
    protected order: Order;

    /**
     * The specific linked route
     */
    protected route: Route | undefined;

    @computedFrom("route")
    protected get stops(): RouteStop[]
    {
        const stops: RouteStop[] = [];

        if (this.route == null)
        {
            return stops;
        }

        for (const stop of this.route.stops)
        {
            if (stop instanceof RouteStop && this.order.slug != null)
            {
                if (stop.orderIds.includes(this.order.slug))
                {
                    stops.push(stop);
                }
            }
        }

        return stops;
    }

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * Called when the routeId has changed
     */
    public idChanged(newValue: string): void
    {
        if (newValue != null)
        {
            this.fetchRoute();
        }
    }

    /**
     * Called by the framework when the module is detached.
     */
    public detached(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        clearTimeout(this.pollTimeout);
    }

    /**
     * Fetches the specified route linked to the order.
     */
    private fetchRoute(): void
    {
        clearTimeout(this.pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            try
            {
                const route = await this._routeService.get(this.id);
                this.route = route;

                if (this.route.status.slug === "in-progress")
                {
                    this.pollTimeout = setTimeout(() => this.fetchRoute(), 10000);
                }
            }
            catch
            {
                this.pollTimeout = setTimeout(() => this.fetchRoute(), 10000);
            }
        });
    }
}
