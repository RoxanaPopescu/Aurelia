import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { VehicleType } from "app/model/vehicle";
import { OrderInfo } from "app/model/order";
import { RouteService } from "app/model/route";

@autoinject
export class BulkActionPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param modal The `Modal` instance.
     */
    public constructor(routeService: RouteService, modal: Modal)
    {
        this._routeService = routeService;
        this._modal = modal;
    }

    private readonly _routeService: RouteService;
    private readonly _modal: Modal;
    private _result: { slug: string; collectionPointIds?: string[] } | undefined;

    /**
     * The model for the modal.
     */
    @bindable
    protected model: { orders: OrderInfo[] };

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The orders for the route to be created from.
     */
    public activate(model: { orders: OrderInfo[] }): void
    {
        this.model = { orders: model.orders.slice() };
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new route's slug, or undefined if cancelled.
     */
    public async deactivate(): Promise<{ slug: string; collectionPointIds?: string[] } | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Cancel" button is clicked.
     * Discards changes and closes the modal.
     */
    protected async onCancel(): Promise<void>
    {
        await this._modal.close();
    }

    /**
     * Called when the "ChangeOrders" icon is clicked.
     * Creates a route and closes the modal.
     */
    protected async onChangeOrdersClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            // Mark the modal as busy.
            this._modal.busy = true;

            const routeSlug = await this._routeService.createRoute(this.model.orders.map(o => o.id), "", VehicleType.getAll()[0]);
            this._result = { slug: routeSlug };

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not create the route", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
