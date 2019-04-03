import { autoinject } from "aurelia-framework";
import { Compose } from "aurelia-templating-resources";
import { ModalService, Modal, IComposedModal } from "../../../services/modal";

/**
 * Represents the stack of modal view currently being presented.
 *
 * ### How to use:
 * Place directly within the root view of the app, after the root `router-view` element.
 * Inject the `ModalService` instance where needed, and use it to open modals.
 */
@autoinject
export class ModalViewCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this.modalService = modalService;
    }

    /**
     * The modal service, managing the stack of modals currently being presented.
     */
    protected modalService: ModalService;

    /**
     * Called for each modal, to get the model to pass to the `activate` method of the modal component,
     * to enrich the modal with a reference to the `compose` element, and to register the modal in the
     * container associated with the `compose` element.
     * @param modal The modal being presented.
     * @param compose The `compose` component presenting the modal.
     * @returns The model to pass to the `activate` method of the modal component.
     */
    protected getModel(modal: IComposedModal, compose: Compose): Modal
    {
        // Store a reference to the `compose` element on the modal.
        // This allows the modal to access the life cycle methods on the component being presented.
        modal.compose = compose;

        // Register the modal in the container associated with the `compose` element.
        // This allows the modal to be injected into the component being presented.
        (compose as any).container.registerInstance(Modal, modal);

        return modal.model;
    }
}
