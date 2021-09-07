import { autoinject, bindable } from "aurelia-framework";
import { ModalService } from "shared/framework";
import { ImageDialog } from "app/modals/dialogs/image/image";
import { Order } from "app/model/collection-point";

@autoinject
export class OrderDetailsCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * The model for the modal.
     */
    @bindable
    public model: Order;

    /**
     * Called when the user clicks the signature.
     */
    protected async onSignatureClick(): Promise<void>
    {
        await this._modalService.open(ImageDialog, { imageUrl: "fixme" }).promise;
    }
}
