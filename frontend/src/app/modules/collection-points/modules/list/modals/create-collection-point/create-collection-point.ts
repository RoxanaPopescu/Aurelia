import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { CollectionPoint, CollectionPointService } from "app/model/collection-point";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class CreateCollectionPointPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param collectionPointService The `CollectionPointService` instance.
     * @param addressService The `AddressService` instance.
     */
    public constructor(modal: Modal, collectionPointService: CollectionPointService, addressService: AddressService)
    {
        this._modal = modal;
        this._collectionPointService = collectionPointService;
        this._addressService = addressService;
    }

    private readonly _modal: Modal;
    private readonly _collectionPointService: CollectionPointService;
    private readonly _addressService: AddressService;
    private _result: CollectionPoint | undefined;

    /**
     * The collection point being edited or created.
     */
    protected collectionPoint: CollectionPoint;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The vehicle to edit, or undefined to create a new vehicle.
     */
    public activate(model?: CollectionPoint)
    {
        this.collectionPoint = model?.clone() ?? new CollectionPoint();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited collection point, or undefined if cancelled.
     */
    public async deactivate(): Promise<CollectionPoint | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Save" or "Create" button is clicked.
     * Saves or creates the collection point, then closes the modal.
     */
    protected async onSaveOrCreateClick(): Promise<void>
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

            this._modal.busy = true;

            // Resolve start location, if needed.
            if (this.collectionPoint.location.position == null && this.collectionPoint.location.address?.id != null)
            {
                try
                {
                    this.collectionPoint.location = await this._addressService.getLocation(this.collectionPoint.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);
                    this._modal.busy = false;

                    return;
                }
            }

            this.collectionPoint = await this._collectionPointService.create(this.collectionPoint);
            this._result = this.collectionPoint;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the vehicle", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
