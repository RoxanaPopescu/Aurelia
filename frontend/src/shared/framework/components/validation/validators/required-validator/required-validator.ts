import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

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
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        this.invalid = this.value === undefined || this.value === "";

        return !this.invalid;
    }
}
