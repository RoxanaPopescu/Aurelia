import { containerless, bindable, noView } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a dependent validator that should run when this validator runs.
 * Use this to trigger validation of dependencies between inputs.
 */
@noView
@containerless
export class DependentValidatorCustomElement extends Validator
{
    /**
     * The dependent validator that should be run when this validator runs.
     */
    @bindable
    public validator: Validator | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        if (this.validator != null)
        {
            await this.validator.validate("none");
        }

        return true;
    }
}
