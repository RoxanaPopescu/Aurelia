import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Route, RouteService, RouteStop } from "app/model/route";
import { GoogleMapCustomElement, GoogleMapType } from "shared/google-maps";
import { CallbackWithContext } from "shared/types";
import { Position } from "app/model/shared";
import { Log } from "shared/infrastructure";

@autoinject
export class RouteMap
{

    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     */
     public constructor(routeService: RouteService)
    {
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;

    private _hasFittedBounds = false;

    /**
     * The map view model.
     */
    protected mapViewModel: GoogleMapCustomElement;

    /**
     * The map instance.
     */
    protected mapInstance: google.maps.Map;

    /**
     * True if the user has interacted with the map, otherwise false.
     */
    protected mapTouched: boolean;

    /**
     * The type of map being presented, or undefined if the map is not ready yet.
     */
    protected mapType: GoogleMapType | undefined;

    /**
     * The recorded driver positions associated with the route, or undefined if not yet fetched.
     */
    protected driverPath: Position[] | undefined;

    /**
     * The state of the `Show driver path` option.
     */
    protected driverPathState: "hidden" | "visible" | "loading" | "empty" = "hidden";

    /**
     * The route to present.
     */
    @bindable
    public route: Route;

    /**
     * The function to call when a route stop is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onStopClick: undefined | CallbackWithContext<
    {
        stop: RouteStop;
    },
    boolean | undefined>;

    /**
     * The function to call when a route stop is double-clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onStopDblClick: undefined | CallbackWithContext<
    {
        stop: RouteStop;
    },
    boolean | undefined>;

    /**
     * The route stops to present.
     */
    @computedFrom("route.stops.length")
    protected get routeStops(): RouteStop[]
    {
        return this.route.stops.filter(s => s instanceof RouteStop) as any;
    }

    /**
     * The route legs to present.
     */
    @computedFrom("route.stops.length")
    protected get routeLegs(): { from: RouteStop; to: RouteStop }[]
    {
        const stops = this.route.stops.filter(s => s.status.slug !== "cancelled");

        return stops.slice(1).map((s, i) => ({ from: stops[i], to: s})) as any;
    }

    /**
     * The driver path segments to present.
     */
    @computedFrom("driverPath.length")
    protected get driverPathSegments(): { from: Position; to: Position }[]
    {
        return this.driverPath?.slice(1).map((s, i) => ({ from: this.driverPath![i], to: s})) as any;
    }

    /**
     * Called by the framework when the component is detached from the DOM.
     */
    public detached(): void
    {
        this._hasFittedBounds = false;
        this.mapViewModel = undefined as any;
        this.mapInstance = undefined as any;
        this.mapTouched = undefined as any;
        this.mapType = undefined as any;
    }

    /**
     * Called by the `google-map` component when the map is being configured.
     * @param options The map options to use.
     */
    protected onMapConfigure(options: google.maps.MapOptions): void
    {
        return;
    }

    /**
     * Called by the `google-map` component when the map has been created.
     * @param map The map instance.
     */
    protected onMapConfigured(mapInstance: google.maps.Map): void
    {
        this.mapInstance = mapInstance;

        if (!this._hasFittedBounds && !this.mapTouched)
        {
            this.tryFitBounds();
        }
    }

    /**
     * Called by the framework when the `route` property changes.
     */
    protected routeChanged(): void
    {
        if (!this._hasFittedBounds && !this.mapTouched)
        {
            setTimeout(() => this.tryFitBounds(), 150);
        }
    }

    /**
     * Attempts to fit the map bounds based on the data being presented.
     */
    protected tryFitBounds(): void
    {
        if (this.mapInstance == null || this.route == null)
        {
            return;
        }

        const routeBounds = new google.maps.LatLngBounds();

        if (this.route)
        {
            for (const stop of this.route.stops)
            {
                routeBounds.extend(stop.location.position!.toGoogleLatLng());
            }

            if (this.route.driverPosition)
            {
                routeBounds.extend(this.route.driverPosition.toGoogleLatLng());
            }
        }

        if (this.driverPathState === "visible")
        {
            for (const position of this.driverPath!)
            {
                routeBounds.extend(position.toGoogleLatLng());
            }
        }

        if (!routeBounds.isEmpty())
        {
            this.mapInstance.fitBounds(routeBounds, { bottom: 60, left: 100, right: 200, top: 80 });
        }

        this._hasFittedBounds = true;
    }

    /**
     * Toggles, and if needed fetches, the recorded driver path.
     */
    protected async toggleDriverPath(): Promise<void>
    {
        if (this.driverPathState === "visible")
        {
            this.driverPathState = "hidden";
        }
        else
        {
            try
            {
                if (this.driverPath == null)
                {
                    this.driverPathState = "loading";

                    this.driverPath = await this._routeService.getDriverPositions(this.route);
                }

                if (this.driverPath.length === 0)
                {
                    this.driverPathState = "empty";
                }
                else
                {
                    this.driverPathState = "visible";
                }
            }
            catch (error)
            {
                Log.error("Could not fetch driver path", error);

                this.driverPathState = "hidden";
            }
        }
    }
}
