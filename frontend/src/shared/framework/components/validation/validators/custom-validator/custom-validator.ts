import { containerless, bindable, bindingMode } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a validator that is always invalid.
 * Use this to manually add validation errors, such as errors received from an API.
 */
@containerless
export class CustomValidatorCustomElement extends Validator
{
    /**
     * True if the validation failed, false if validation succeeded,
     * or undefined if not yet validated.
     */
    @bindable({ defaultBindingMode: bindingMode.toView })
    public invalid: boolean | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        return !this.invalid;
    }
}
