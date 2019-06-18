import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationTrigger } from "../../validation-trigger";

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
            this.invalid =
                this._pattern != null && !this._pattern.test(this.value);
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
