import { containerless, bindable, noView } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that runs a dependent validator whenever this validator runs.
 * Use this to trigger validation of dependencies between inputs.
 */
@noView
@containerless
export class DependentValidatorCustomElement extends Validator
{
    /**
     * The dependent validator, or validators, that should be run when this validator runs.
     * If any dependent validator is invalid, this validator will become invalid too.
     */
    @bindable
    public validators: Validator | Validator[] | undefined;

    /**
     * True to set the validity of this validator, based on the validity of the dependent validators, otherwise false.
     */
    @bindable({ defaultValue: true })
    public setValidity: boolean;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        let invalid = true;

        if (this.validators == null)
        {
            invalid = false;
        }
        else if (this.validators instanceof Validator)
        {
            invalid = await this.validators.validate("dependency");
        }
        else
        {
            const results = await Promise.all(this.validators.map(v => v.validate("dependency")));
            invalid = results.some(r => !r);
        }

        if (this.setValidity)
        {
            this.invalid = invalid;
        }

        return true;
    }
}
