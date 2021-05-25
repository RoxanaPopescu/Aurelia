import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { OrderGroup } from "app/model/order-group";

@autoinject
export class DeleteOrderGroupDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result = false;

    protected model: OrderGroup;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: OrderGroup): void
    {
        this.model = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the stop should be cancelled, otherwise false.
     */
    public deactivate(): boolean
    {
        return this._result;
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(result: boolean): Promise<void>
    {
        this._result = result;

        await this._modal.close();
    }
}