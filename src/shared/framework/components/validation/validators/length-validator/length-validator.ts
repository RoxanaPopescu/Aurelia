import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that validates that the length of
 * a `string`, `number`, `Array`, `Set` or `Map`, or any object that has a `length` property of type `number`,
 * satisfies the specified range requirements.
 *
 * Note that a value of undefined is always considered valid.
 */
@containerless
export class LengthValidatorCustomElement extends Validator
{
    /**
     * The value to validate, or undefined.
     */
    @bindable
    public value: { length: number } | number | any[] | Set<any> | Map<any, any> | undefined;

    /**
     * The min length, or undefined to disable this requirement.
     */
    @bindable
    public min: number | undefined;

    /**
     * The max length, or undefined to disable this requirement.
     */
    @bindable
    public max: number | undefined;

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
            const length =
                this.value instanceof Array ? this.value.length :
                this.value instanceof Set ? this.value.size :
                this.value instanceof Map ? this.value.size :
                this.value.toString().length;

            this.invalid =
                this.min != null && length < this.min ||
                this.max != null && length > this.max;
        }

        return !this.invalid;
    }
}
