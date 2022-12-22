import { bindable, containerless } from "aurelia-framework";
import { Validator } from "../../validator";
import { ValidationReason } from "../../validation-trigger";

/**
 * Represents a validator that validates that a value is not undefined.
 */
@containerless
export class RequiredValidatorCustomElement extends Validator
{
    /**
     * The value to validate.
     */
    @bindable
    public value: any;

    /**
     * True to show a validation message, otherwise false.
     */
    @bindable({ defaultValue: true })
    public showMessage: boolean;

    /**
     * Called by the framework when the component is attached.
     * Updates the decoration of the input element, then delegates
     * to the super implementation.
     */
    public async attached(): Promise<void>
    {
        this.decorateInput();

        return super.attached();
    }

    /**
     * Called by the framework when the component is detached.
     * Updates the decoration of the input element, then delegates
     * to the super implementation.
     */
    public detached(): void
    {
        this.decorateInput();

        super.detached();
    }

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason: ValidationReason): Promise<boolean>
    {
        this.invalid = this.value === undefined || this.value === "";

        return !this.invalid;
    }

    /**
     * Called by the framework when the `enabled` property changes.
     * Updates the decoration of the input element, then delegates
     * to the super implementation.
     */
    protected enabledChanged(): void
    {
        this.decorateInput();

        super.enabledChanged();
    }

    /**
     * Decorates the input element, if found, to indicate that a value is required.
     */
    private decorateInput(): void
    {
        const closestInput = this.element.parentElement?.closest?.(".input");

        closestInput?.classList.toggle("--required", this.enabled);
    }
}
