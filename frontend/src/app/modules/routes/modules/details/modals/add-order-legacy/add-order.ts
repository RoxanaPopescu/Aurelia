import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { Route, RouteService } from "app/model/route";
import { Log } from "shared/infrastructure";

@autoinject
export class AddOrderLegacyPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param router The `Router` instance.
     * @param modal The `Modal` instance.
     * @param routeService The `OrderService` instance.
     * /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */

     public constructor(modal: Modal, routeService: RouteService)
    {
        this._modal = modal;
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;
    private readonly _modal: Modal;
    private _result: Route | undefined;

    /**
     * The slug identifying the order to add.
     */
    protected orderSlug: string;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

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

    protected async onAddClick(): Promise<void>
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

            // Save the changes.
            await this._routeService.addOrder(this.model, this.orderSlug);

            // Set the result of the modal.
            this._result = this.model;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not add the order", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
