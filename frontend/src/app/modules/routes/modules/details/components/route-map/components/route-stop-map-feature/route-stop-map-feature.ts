import { autoinject, useShadowDOM, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "shared/google-maps";
import { RouteStop } from "app/model/route/entities/route-stop";
import { Route } from "app/model/route";

@autoinject
@useShadowDOM
export class RouteStopMapFeatureCustomElement
{
    /**
     * The element representing the component, and the content to be presented.
     */
    protected element: HTMLElement;

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
     * The route stop to present.
     */
     @bindable
    public routeStop: RouteStop;

    /**
     * The function to call when the route stop is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * The function to call when the route stop is double-clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onDblClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the point representing the route stop, if available.
     */
    @computedFrom("routeStop.location.position")
    protected get point(): GeoJsonPoint
    {
        return this.routeStop.location.position!.toGeoJsonPoint();
    }
}
