import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { RouteStatus, Route } from 'app/model/route';
import { IValidation } from "shared/framework";
import { ProductType } from '../../../../../../model/product/entities/product-type';
import { Log } from "shared/infrastructure";
import { RouteService } from '../../../../../../model/route/services/route-service';


@autoinject
export class EditInformationPanel
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
        this._routeService = routeService
    }

    private readonly _routeService: RouteService;
    private readonly _modal: Modal;
    private _result: Route | undefined;

     /**
     * The validation for the modal.
     */
    protected validation: IValidation;
     /**
     * The available statuses.
     */
    protected statusValues = Object.keys(RouteStatus.values).map(slug => new RouteStatus(slug as any));

    /**
     * The available stop types.
     */
    protected types = Object.keys(ProductType.values).map(slug => new ProductType(slug as any))

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
    protected async onSaveClick(): Promise<void>
    {
        try
        {

            // Mark the modal as busy.
            this._modal.busy = true;

            // Save the changes.
            await this._routeService.updateRoute(this.model);

            // Set the result of the modal.
            this._result = this.model;
            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not update route", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
