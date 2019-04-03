import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";

@autoinject
export class SearchPanelCustomElement
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
