import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that validates that a value is unique
 * within a set of values.
 */
@containerless
export class UniqueValidatorCustomElement extends Validator
{
    /**
     * The new value to validate.
     */
    @bindable
    public newValue: any | undefined;

    /**
     * The old value, used to avoid a self-collision.
     */
    @bindable
    public oldValue: any | undefined;

    /**
     * The existing values that the new value must not collide with,
     * except for the case where the new value equals the old value.
     */
    @bindable
    public allValues: any[] | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        // tslint:disable-next-line: triple-equals
        if (this.newValue == this.oldValue)
        {
            this.invalid = false;
        }
        else
        {
            const newPrimitiveValue = this.newValue.valueOf();
            const oldPrimitiveValue = this.newValue.valueOf();

            // tslint:disable-next-line: triple-equals
            if (newPrimitiveValue == oldPrimitiveValue)
            {
                this.invalid = false;
            }

            if (this.allValues != null)
            {
                // tslint:disable-next-line: triple-equals
                this.invalid = this.allValues.some(value => value == this.newValue || value.valueOf() === newPrimitiveValue);
            }
        }

        return !this.invalid;
    }
}
