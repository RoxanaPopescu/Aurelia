import { inject, bindable, Optional } from "aurelia-framework";
import { Modal, ModalCloseReason } from "shared/framework/services/modal";

/**
 * Represents the `dashboard` modal overlay.
 * This acts as the central navigation hub for the app.
 */
@inject(Optional.of(Modal, true))
export class DashboardModal
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal, or undefined if not presented as a modal.
     */
    public constructor(modal: Modal | undefined)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal | undefined;

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
        // TODO
    }

    /**
     * Called by the framework when the modal is deactivating.
     * @param reason The reason for closing the modal.
     */
    public deactivate(reason?: ModalCloseReason): void
    {
        if (reason !== undefined && reason !== "navigation")
        {
            // tslint:disable-next-line: no-string-throw
            throw "This overlay should only close when requested by the user, or when navigating.";
        }
    }

    /**
     * Closes the modal, if presented as a modal.
     */
    protected async close(): Promise<void>
    {
        await this._modal?.close();
    }
}
