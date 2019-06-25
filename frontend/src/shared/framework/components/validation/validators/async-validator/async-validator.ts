import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";
import { Operation } from "shared/types";

/**
 * Represents a validator that validates by calling a function.
 * Note that the function may be async, and that an `AbortSignal` is provided,
 * that will be triggered if a new validation run starts.
 *
 * Note that a value of undefined is always considered valid.
 */
@containerless
export class AsyncValidatorCustomElement extends Validator
{
    private _operation: Operation | undefined;

    /**
     * The function that should be called to validate the value,
     * or undefined to disable this requirement.
     */
    @bindable
    public function: (params:
    {
        /**
         * The abort signal, which will be triggered if a new validation run starts.
         */
        signal: AbortSignal;

    }) => Promise<boolean>;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    public async validate(trigger: ValidationTrigger): Promise<boolean>
    {
        if (this._operation != null)
        {
            this._operation.abort();
        }

        if (this.function == null)
        {
            this.invalid = false;
        }
        else
        {
            this._operation = new Operation(async signal =>
            {
                this.invalid = await this.function({ signal });

                this._operation = undefined;
            });
        }

        return !this.invalid;
    }
}
