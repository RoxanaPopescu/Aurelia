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
    private _regExp: RegExp | undefined;

    /**
     * The value to validate, or undefined.
     */
    @bindable
    public value: string | undefined;

    /**
     * The regular expression to match, or undefined to disable this requirement.
     */
    @bindable
    public pattern: string | RegExp | undefined;

    /**
     * The regular expression flags use, if the pattern is specified as a string.
     */
    @bindable
    public flags: string | undefined;

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
            const match = this._regExp != null && !this._regExp.test(this.value);

            this.invalid = this.invert ? !match : match;
        }

        return !this.invalid;
    }

    /**
     * Called by the framework when the `pattern` property changes.
     */
    protected patternChanged(): void
    {
        this.updateRegExp();
    }

    /**
     * Called by the framework when the `flags` property changes.
     */
    protected flagsChanged(): void
    {
        this.updateRegExp();
    }

    /**
     * Updates the regular expression to match the specified pattern and flags.
     */
    private updateRegExp(): void
    {
        this._regExp =
            !this.pattern ? undefined :
            this.pattern instanceof RegExp ? this.pattern :
            new RegExp(this.pattern, this.flags);
    }
}
