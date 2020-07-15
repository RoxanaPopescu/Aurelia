import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

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
     * True if the value is outside the range, otherwise false.
     */
    protected invalidValue = false;

    /**
     * True if the value is not a multiple of the step size, otherwise false.
     */
    protected invalidStep = false;

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
     * The step size of which the value must be a multiple, or undefined to disable this requirement.
     */
    @bindable
    public step: { valueOf(): number } | undefined;

    /**
     * True to include the min value as a valid value, otherwise false.
     */
    @bindable({ defaultValue: true })
    public minInclusive: boolean | undefined;

    /**
     * True to include the max value as a valid value, otherwise false.
     */
    @bindable({ defaultValue: true })
    public maxInclusive: boolean | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        if (this.value == null)
        {
            this.invalid = false;
        }
        else
        {
            const value = this.value.valueOf();

            this.invalidValue =
                this.min != null && (this.minInclusive ? value < this.min.valueOf() : value <= this.min.valueOf()) ||
                this.max != null && (this.maxInclusive ? value > this.max.valueOf() : value >= this.max.valueOf());

            this.invalidStep = this.step != null && value % this.step.valueOf() !== 0;

            this.invalid = this.invalidValue || this.invalidStep;
        }

        return !this.invalid;
    }

    /**
     * Resets this validator to the default validity state, then updates the ancestor validations.
     */
    public reset(): void
    {
        this.invalidValue = false;
        this.invalidStep = false;

        super.reset();
    }
}
