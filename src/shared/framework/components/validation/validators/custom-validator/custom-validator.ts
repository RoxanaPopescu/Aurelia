import { containerless, bindable } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator whose validity is bound to a view model property,
 * but not applied to the validation until the validator actually runs.
 * Use this to validate e.g. dependencies between inputs.
 */
@containerless
export class CustomValidatorCustomElement extends Validator
{
    /**
     * True if the validation should succeed, false if validation should fail.
     */
    @bindable
    public valid: boolean;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        this.invalid = !this.valid;

        return this.valid;
    }
}
