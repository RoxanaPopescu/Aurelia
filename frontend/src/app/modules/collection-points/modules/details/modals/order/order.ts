import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { CollectionPointService, Order } from "app/model/collection-point";
import { Log } from "shared/infrastructure";

@autoinject
export class CollectionPointOrderPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param addressService The `AddressService` instance.
     */
    public constructor(collectionPointService: CollectionPointService, modal: Modal)
    {
        this._collectionPointService = collectionPointService;
        this._modal = modal;
    }

    private readonly _collectionPointService: CollectionPointService;
    private readonly _modal: Modal;
    private _result: Order | undefined;

    /**
     * The model for the modal.
     */
    protected model: Order;

    /**
     * True if the model is in edit mode, otherwise false.
     */
    protected edit = false;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { order: Order; edit: boolean }): void
    {
        this.model = model.order.clone();
        this.edit = model.edit;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<Order | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Edit" icon is clicked.
     * Transitions the modal to its edit mode.
     */
    protected onEditToggle(): void
    {
        this.edit = !this.edit;
    }

     /**
      * Called when the "Save" icon is clicked.
      * Saves changes and transitions the modal to its readonly mode.
      */
     protected async onSaveClick(): Promise<void>
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

             // Save changes.
             if (this.model.status.slug === "collected")
             {
                await this._collectionPointService.orderCollected(this.model);
             }
             else
             {
                await this._collectionPointService.saveDeviation(this.model);
             }

             // Set the result of the modal.
             this._result = this.model;

             // Transition the modal to its readonly mode.
             this.edit = false;
         }
         catch (error)
         {
             Log.error("Could not save the status change", error);
         }
         finally
         {
             // Mark the modal as not busy.
             this._modal.busy = false;
         }
     }
}
