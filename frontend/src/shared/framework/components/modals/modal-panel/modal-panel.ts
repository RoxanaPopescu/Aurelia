import { inject, bindable, Optional, computedFrom } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Modal } from "../../../services/modal";

/**
 * Represents a modal panel to be presented in the `modal-view`.
 *
 * ### How to use:
 * Place directly within the `template` element for the panel view.
 * When scoping styles, use a selector such as `modal-panel[name="example"]`.
 */
@inject(Element, Optional.of(Modal, true))
export class ModalPanelCustomElement
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
     * True until after the component has been attached.
     * This prevents animation conflicts while the modal animates in.
     */
    protected preventBusyAnimationDelay = true;

    /**
     * The name of the panel.
     * Note that this should be unique among the panels in the app.
     */
    @bindable
    public name: string;

    /**
     * True to show a close button and close on outside click, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeButton: boolean;

    /**
     * True if the close button should switch to using `discard-changes` as modal close reason,
     * if the modal has refused to close and validation errors are present, otherwise false.
     */
    @bindable({ defaultValue: false })
    public discardChanges: boolean;

    /**
     * True if the close button should use `discard-changes` as modal close reason, otherwise false.
     */
    @computedFrom("modal.refusedToClose", "discardChanges", "validation")
    protected get shouldDiscardChanges(): boolean
    {
        return !!this.modal?.refusedToClose && this.discardChanges && this.validation.invalid === true;
    }

    /**
     * The position of the panel relative to the viewport.
     */
    @bindable({ defaultValue: "left" })
    public position: "left" | "right";

    /**
     * True to close when the `Escape` key is pressed, otherwise false.
     */
    @bindable({ defaultValue: true })
    public closeShortcut: boolean;

    /**
     * Called by the framework when the component is attached.
     */
    protected attached(): void
    {
        // Allow the busy overlay to initially appear without delay, then remove the delay override.
        setTimeout(() => this.preventBusyAnimationDelay = false, 1000);
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
