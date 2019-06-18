import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a validator that validates that an input element does not contain a badly formatted value,
 * as determined by the validation built into the input element.
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
     * @returns True if validation succeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        this.invalid = this.input.validity.badInput;

        return !this.invalid;
    }
}
