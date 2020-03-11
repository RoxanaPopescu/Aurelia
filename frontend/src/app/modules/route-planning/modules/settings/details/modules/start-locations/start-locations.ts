import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings } from "app/model/_route-planning-settings";
import { DepartureTime } from '../../../../../../../model/_route-planning-settings/entities/departure-time';

/**
 * Represents the page.
 */
@autoinject
export class StartLocations
{
    /**
     * Current tab page the user is routed to.
     */
    protected activeDepartureTime: DepartureTime | undefined;

    /**
     * The id of the routeplan settings
     */
    @bindable
    protected settings: RoutePlanningSettings;

    /**
     * Called by the framework when the module is activated.
     */
    public settingsChanged(newValue: RoutePlanningSettings): void
    {
        console.log(newValue.departureTimes)
        this.activeDepartureTime = newValue.departureTimes[0];
    }
}
