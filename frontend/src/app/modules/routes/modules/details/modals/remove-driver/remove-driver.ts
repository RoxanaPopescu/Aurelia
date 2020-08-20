import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework";
import { Route, RouteService } from 'app/model/route';
import { Log } from "shared/infrastructure";

@autoinject
export class RemoveDriverPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     * @param routeService The `OrderService` instance.
     */
    public constructor(modal: Modal, routeService: RouteService)
    {
        this._modal = modal;
        this._routeService = routeService
    }

    private readonly _routeService: RouteService;
    private readonly _modal: Modal;
    private _result: Route | undefined;

    /**
     * The model for the modal.
     */
    public model: Route;

    /**
     * Called by the framework when the modal is activated.
     */
    public activate(model: { route: Route }): void
    {
        this.model = model.route.clone();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public async deactivate(): Promise<Route | undefined>
    {
        return this._result;
    }

    /**
     * Called when the driver should be removed.
     */
    protected async onRemoveClick(): Promise<void>
    {
        try
        {
            // Mark the modal as busy.
            this._modal.busy = true;

            // Save the changes.
            await this._routeService.removeDriver(this.model);

            // Set the result of the modal.
            this._result = this.model;
            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not remove the driver", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}