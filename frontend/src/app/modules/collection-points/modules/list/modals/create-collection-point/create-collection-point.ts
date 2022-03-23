import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { CollectionPoint, CollectionPointService } from "app/model/collection-point";

@autoinject
export class CreateCollectionPointPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param collectionPointService The `CollectionPointService` instance.
     */
    public constructor(modal: Modal, collectionPointService: CollectionPointService)
    {
        this._modal = modal;
        this._collectionPointService = collectionPointService;
    }

    private readonly _modal: Modal;
    private readonly _collectionPointService: CollectionPointService;
    private _result: CollectionPoint | undefined;

    /**
     * The collection point being edited or created.
     */
    protected collectionPoint: CollectionPoint | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The vehicle to edit, or undefined to create a new vehicle.
     */
    public async activate(model?: CollectionPoint): Promise<void>
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

            this.collectionPoint = await this._collectionPointService.create(this.collectionPoint!);
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
