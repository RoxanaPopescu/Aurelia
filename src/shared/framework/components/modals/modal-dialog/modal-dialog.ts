import { inject, bindable, Optional, computedFrom } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { AccentColor } from "resources/styles";
import { Modal } from "../../../services/modal";

/**
 * Represents a dialog to be presented in the `modal-view`.
 *
 * ### How to use:
 * Place directly within the `template` element for the dialog view.
 * When scoping styles, use a selector such as `modal-dialog[name="example"]`.
 */
@inject(Element, Optional.of(Modal, true))
export class ModalDialogCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(element: Element, modal?: Modal)
    {
        this.element = element as HTMLElement;
        this.modal = modal;
    }

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * The `Modal` instance representing the modal.
     */
    protected readonly modal: Modal | undefined;

    /**
     * The validation for the component.
     */
    protected validation: IValidation;

    /**
     * The name of the dialog.
     * Note that this should be unique among the dialogs in the app.
     */
    @bindable
    public name: string;

    /**
     * True to show a close button and close on outside click, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeButton: boolean;

    /**
     * True to close when the `Escape` key is pressed, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeShortcut: boolean;

    /**
     * The accent of the dialog, or undefined to apply no accent.
     * The default is undefined.
     */
    @bindable
    public accent?: AccentColor;

    /**
     * True if the close button should switch to using `discard-changes` as modal close reason,
     * if the modal has refused to close and validation errors are present, otherwise false.
     */
    @bindable({ defaultValue: false })
    public discardChanges: boolean;

    /**
     * True if the close button should use `discard-changes` as modal close reason, otherwise false.
     */
    @computedFrom("modal.refusedToClose", "discardChanges", "validation.invalid")
    protected get shouldDiscardChanges(): boolean
    {
        return !!this.modal?.refusedToClose && this.discardChanges && this.validation.invalid === true;
    }

    /**
     * Called when the close button is clicked.
     */
    protected onCloseClick(): void
    {
        if (this.modal != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.modal.close(this.modal.refusedToClose ? "discard-changes" : undefined);
        }
    }

    /**
     * Called when a key is pressed.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.key === "Escape" && !event.defaultPrevented && this.closeShortcut && this.modal != null)
        {
            // tslint:disable-next-line: no-floating-promises
            this.modal.close();

            return false;
        }

        return true;
    }
}
