import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a validator that validates that a value is not undefined.
 */
@containerless
export class RequiredValidatorCustomElement extends Validator
{
    /**
     * The value to validate.
     */
    @bindable
    public value: any;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        this.invalid = this.value === undefined || this.value === "";

        return !this.invalid;
    }
}
