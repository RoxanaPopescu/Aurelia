import { autoinject, containerless, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "shared/google-maps";
import { Route, RouteStop } from "app/model/route";

/**
 * Represents a map feature that presents a leg of the route
 * as a line from one stop to the next.
 */
@autoinject
@containerless
export class RouteLegMapFeatureCustomElement
{
    /**
     * The map view model.
     */
     @bindable
    public mapViewModel: GoogleMapCustomElement;

    /**
     * The route to present.
     */
     @bindable
    public route: Route;

    /**
     * The route stop representing the beginning of the leg.
     */
     @bindable
    public fromRouteStop: RouteStop;

    /**
     * The route stop representing the end of the leg.
     */
    @bindable
    public toRouteStop: RouteStop;

    /**
     * The function to call when the route leg is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the points representing the beginning and end of the route leg, if available.
     */
    @computedFrom("fromRouteStop.location.position", "toRouteStop.location.position")
    protected get points(): GeoJsonPoint[]
    {
        return [this.fromRouteStop.location.position!.toGeoJsonPoint(), this.toRouteStop.location.position!.toGeoJsonPoint()];
    }
}
