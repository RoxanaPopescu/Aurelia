import { autoinject, computedFrom } from "aurelia-framework";

/**
 * Custom element representing a fake password, intended to be used as a placeholder
 * within a password input that has a value, but where the value is not known.
 */
@autoinject
export class PasswordInputPlaceholderCustomElement
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
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Try to get the closest password input element.
        const inputElement = this._element.closest("password-input") as HTMLElement & { au: any };

        if (inputElement?.au?.controller?.viewModel == null)
        {
            throw new Error("This element must be placed within an input element.");
        }

        // Store the reference to the input element.
        this._inputElement = inputElement;
    }
}
