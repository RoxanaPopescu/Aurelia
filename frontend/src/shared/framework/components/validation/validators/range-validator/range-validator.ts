import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

/**
 * Represents a validator that validates that
 * a `number`, or any object that has a `valueOf()` method that returns a `number`,
 * satisfies the specified range requirements.
 *
 * Note that a value of undefined is always considered valid.
 */
@containerless
export class RangeValidatorCustomElement extends Validator
{
    /**
     * The value to validate, or undefined.
     */
    @bindable
    public value: { valueOf(): number } | undefined;

    /**
     * The min value, or undefined to disable this requirement.
     */
    @bindable
    public min: { valueOf(): number } | undefined;

    /**
     * The max value, or undefined to disable this requirement.
     */
    @bindable
    public max: { valueOf(): number } | undefined;

    /**
     * The step size of which the value must be a multiple,
     * or undefined to disable this requirement.
     */
    @bindable
    public step: { valueOf(): number } | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        if (this.value == null)
        {
            this.invalid = false;
        }
        else
        {
            const value = this.value.valueOf();

            this.invalid =
                this.min != null && value < this.min.valueOf() ||
                this.max != null && value > this.max.valueOf() ||
                this.step != null && value % this.step.valueOf() !== 0;
        }

        return !this.invalid;
    }
}
