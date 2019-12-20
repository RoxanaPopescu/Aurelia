import { autoinject, bindable } from "aurelia-framework";
import { RouteStop, RouteStopStatus, RouteService, RouteStopStatusSlug } from "app/model/route";
import { Collo, ColloStatus, ColloStatusSlug } from "app/model/collo";
import { Log } from "shared/infrastructure";

@autoinject
export class RouteStopDetailsCustomElement
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

    /**
     * The model for the modal.
     */
    @bindable
    protected model: RouteStop;

    /**
     * The available stop status values.
     */
    protected stopStatusValues = Object.keys(RouteStopStatus.values).map(slug => ({ slug, ...RouteStopStatus.values[slug] }));

    /**
     * The available collo status values.
     */
    protected colloStatusValues = Object.keys(ColloStatus.values).map(slug => ({ slug, ...ColloStatus.values[slug] }));

    /**
     * Called when the user changes the status of the stop.
     * Sets the new status.
     * @param status The new status value.
     */
    protected async onStopStatusChange(status: RouteStopStatusSlug): Promise<void>
    {
        if (status === this.model.status.slug)
        {
            return;
        }

        try
        {
            await this._routeService.setRouteStopStatus(this.model, status);
        }
        catch (error)
        {
            Log.error("Could not change route stop status", error);
        }
    }

    /**
     * Called when the user changes the status of a collo.
     * Sets the new status.
     * @param collo The collo for which the status is being changed.
     * @param status The new status value.
     */
    protected async onColloStatusChange(collo: Collo, status: ColloStatusSlug): Promise<void>
    {
        if (status === collo.status.slug)
        {
            return;
        }

        try
        {
            await this._routeService.setColloStatus(collo, status);
        }
        catch (error)
        {
            Log.error("Could not change collo status", error);
        }
    }
}
