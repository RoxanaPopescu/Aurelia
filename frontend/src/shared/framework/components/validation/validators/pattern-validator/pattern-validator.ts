import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that validates that
 * a `string`
 * matches the specified pattern.
 *
 * Note that a value of undefined is always considered valid.
 */
@containerless
export class PatternValidatorCustomElement extends Validator
{
    private _pattern: RegExp | undefined;

    /**
     * The value to validate, or undefined.
     */
    @bindable
    public value: string | undefined;

    /**
     * The pattern to match, or undefined to disable this requirement.
     */
    @bindable
    public pattern: string | RegExp | undefined;

    /**
     * True to invert the validation, meaning that a valid input is one that does not match the pattern.
     */
    @bindable({ defaultValue: false })
    public invert: boolean;

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
            const match = this._pattern != null && !this._pattern.test(this.value);

            this.invalid = this.invert ? !match : match;
        }

        return !this.invalid;
    }

    /**
     * Called by the framework when the `pattern`property changes.
     */
    protected patternChanged(): void
    {
        this._pattern =
            !this.pattern ? undefined :
            this.pattern instanceof RegExp ? this.pattern :
            new RegExp(this.pattern);
    }
}
