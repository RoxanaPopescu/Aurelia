import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

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
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        this.invalid = !this.input.validity.valid;

        return !this.invalid;
    }
}
