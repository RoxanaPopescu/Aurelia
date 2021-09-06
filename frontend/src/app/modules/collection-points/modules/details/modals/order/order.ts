import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Order } from "app/model/collection-point";

@autoinject
export class CollectionPointOrderPanel
{
    private _result: Order | undefined;

    /**
     * The model for the modal.
     */
    protected model: Order;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: Order): void
    {
        this.model = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<Order | undefined>
    {
        this._result = this.model;
        return this._result;
    }
}
