import { autoinject, bindable } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

@autoinject
export class DashboardModalCustomElement
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

    /**
     * True if the modal can be closed by the user, otherwise false.
     * This should only be false when presented as the landing page after sign in.
     */
    @bindable({ defaultValue: true })
    public allowClose: boolean;

    /**
     * Called by the framework when the modal is activated.
     */
    public activate(): void
    {
        console.log("activate");
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public deactivate(): void
    {
        console.log("deactivate");
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onButtonClick(): Promise<void>
    {
        await this._modal.close();
    }
}
