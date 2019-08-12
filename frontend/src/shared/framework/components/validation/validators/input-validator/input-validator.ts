import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

const preventDefault = (event: Event) => event.preventDefault();

/**
 * Represents a validator that validates that a standard input element does not contain
 * an invalid value, as determined by the validation built into the input element.
 */
@containerless
export class InputValidatorCustomElement extends Validator
{
    /**
     * The input to validate.
     */
    @bindable
    public input: HTMLInputElement;

    /**
     * Called by the framework when the component is attached.
     */
    public async attached(): Promise<void>
    {
        // Prevent the browser validation UI from appearing.
        this.input.addEventListener("invalid", preventDefault, true);

        return super.attached();
    }

    /**
     * Called by the framework when the component is detached.
     */
    public async detached(): Promise<void>
    {
        // Prevent the browser validation UI from appearing.
        this.input.removeEventListener("invalid", preventDefault, true);

        return super.attached();
    }

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        this.invalid = !this.input.validity.valid;

        return !this.invalid;
    }
}
