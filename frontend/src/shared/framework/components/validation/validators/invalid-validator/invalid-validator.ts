import { containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a validator that is always invalid.
 * Use this to manually add validation errors, such as errors received from an API.
 */
@containerless
export class InvalidValidatorCustomElement extends Validator
{
    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        return false;
    }
}
