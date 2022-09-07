import { autoinject, useShadowDOM, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "shared/google-maps";
import { Driver } from "app/model/driver";
import { Route } from "app/model/route";

@autoinject
@useShadowDOM
export class RouteDriverMapFeatureCustomElement
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
     * The driver to present.
     */
     @bindable
    public driver: Driver;

    /**
     * The route to present.
     */
     @bindable
    public route: Route;

    /**
     * The function to call when the driver is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * The function to call when the driver is double-clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onDblClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the point representing the driver, if available.
     */
    @computedFrom("driver.position")
    protected get point(): GeoJsonPoint | undefined
    {
        return this.route.driverPosition?.toGeoJsonPoint();
    }
}
