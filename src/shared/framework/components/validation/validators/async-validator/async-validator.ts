import { bindable, containerless } from "aurelia-framework";
import { AsyncCallbackWithContext } from "shared/types";
import { Operation } from "shared/utilities";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

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
    /**
     * The most recent operation, if any.
     */
    protected operation: Operation | undefined;

    /**
     * The function that should be called to validate the value, or undefined to disable this validator.
     * @returns A promise that should be resolved with true if validation succeeded, otherwise false.
     */
    @bindable
    public function: AsyncCallbackWithContext<
    {
        /**
         * The reason for the validation run.
         */
        reason: ValidationReason;

        /**
         * The abort signal, which will be triggered if a new validation run starts.
         */
        signal: AbortSignal;
    },
    boolean>;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        if (this.operation != null)
        {
            this.operation.abort();
        }

        if (this.function == null)
        {
            this.invalid = false;
        }
        else
        {
            this.operation = new Operation(async signal =>
            {
                try
                {
                    this.invalid = !await this.function({ reason, signal });
                }
                catch (error)
                {
                    if (this.computedEnabled)
                    {
                        this.invalid = true;
                    }

                    throw error;
                }
            });

            await this.operation.promise.catch(() => undefined);
        }

        return !this.invalid;
    }

    /**
     * Resets this validator to the default validity state, then updates the ancestor validations.
     */
    public reset(): void
    {
        // Abort any pending operation.
        if (this.operation?.pending)
        {
            this.operation.abort();
        }

        super.reset();
    }
}
