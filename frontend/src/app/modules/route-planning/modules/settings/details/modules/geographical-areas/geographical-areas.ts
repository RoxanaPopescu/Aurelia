import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings } from "app/model/_route-planning-settings";

/**
 * Represents the page.
 */
@autoinject
export class GeographicalAreas
{
    /**
     * The id of the routeplan settings
     */
    @bindable
    protected settings: RoutePlanningSettings;
}
