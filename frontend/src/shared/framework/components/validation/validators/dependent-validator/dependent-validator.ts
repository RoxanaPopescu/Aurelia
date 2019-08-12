import { containerless, bindable, noView } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

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
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        if (this.validator != null)
        {
            await this.validator.validate("dependency");
        }

        return true;
    }
}
