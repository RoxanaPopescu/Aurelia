import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { AsyncCallback } from "shared/types";

/**
 * Represents a button that, when placed in the `before` or `after` slot of an input,
 * ensures that input is readonly until the button is clicked, thereby preventing
 * the user from accidentaly changing the value of the input.
 *
 * This is useful for protecting e.g. email, username and password inputs, where an
 * accidental change could lock the user out of the account, or worse.
 */
@autoinject
export class InputLockCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private _inputElement: HTMLElement & { au: any };

    /**
     * Gets the current value of the `readonly` property of the input view model.
     */
    @computedFrom("_inputElement.au.controller.viewModel.readonly")
    protected get locked(): boolean | undefined
    {
        return this._inputElement?.au?.controller?.viewModel?.readonly;
    }

    /**
     * The function to call when the user attempts to unlock.
     * @returns A promise that will be resolved with true to allow the unlocking, otherwise false.
     */
    @bindable
    public unlock: AsyncCallback<boolean>;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Try to get the closest input element.
        const inputElement = this._element.closest(".input") as HTMLElement & { au: any };

        if (inputElement?.au?.controller?.viewModel == null)
        {
            throw new Error("This element must be placed within an input element.");
        }

        // Store the reference to the input element.
        this._inputElement = inputElement;

        // Set the initial value of the `readonly` property of the input view model to true.
        this._inputElement.au.controller.viewModel.readonly = true;
    }

    /**
     * Called when the button is clicked.
     */
    protected async onClick(): Promise<void>
    {
        if (this.unlock == null || await this.unlock())
        {
            // Sets the value of the `readonly` property of the input view model to false.
            this._inputElement.au.controller.viewModel.readonly = false;

            // HACK: We need to delay this, as e.g. a password dialog needs time to close.
            // Focus the input.
            setTimeout(() => this._inputElement.focus(), 50);
            setTimeout(() => this._inputElement.focus(), 500);
            setTimeout(() => this._inputElement.focus(), 1000);
        }
    }
}
