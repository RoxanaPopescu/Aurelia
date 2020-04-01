import { containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that is always invalid.
 * Use this to manually add validation errors, such as errors received from an API.
 */
@containerless
export class InvalidValidatorCustomElement extends Validator
{
    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        this.invalid = true;

        return false;
    }
}
