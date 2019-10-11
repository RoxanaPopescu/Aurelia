import { Container, inject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ValidationCustomAttribute } from "./validation";
import { ValidationTrigger, ValidationReason } from "./validation-trigger";

import "./validator.scss";

/**
 * Represents a validator, associated with a validation.
 *
 * This interface represents the public API of a validator, and
 * should be used as the type for any references to a validator
 * attribute instance.
 */
export interface IValidator
{
    /**
     * True to enable this validation, false to disable this validation,
     * or undefined to inherit the enabled state from the parent validation.
     *
     * If no parent validation exists, the computed default is true.
     *
     * Note that if the parent validation is disabled, this validator will
     * be disabled too, regardless of the value of this property.
     */
    enabled: boolean | undefined;

    /**
     * True to validate on trigger events, false to not validate on trigger
     * events, or undefined to inherit the active state from the parent validation.
     *
     * If no parent validation exists, the computed default is null.
     *
     * Note that if the parent validation is inactive, this validator will
     * be inactive too, regardless of the value of this property.
     */
    active: boolean | undefined;

    /**
     * The trigger to use for this validator, or undefined to
     * inherit the trigger from the parent validation.
     *
     * If no parent validation exists, the computed default is `input`.
     */
    trigger: ValidationTrigger | undefined;

    /**
     * True if validation failed, false if validation succeeded,
     * or undefined if this validator is computed as disabled,
     * or if validation has not yet run.
     */
    invalid: boolean | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation
     * succeeded, otherwise false.
     */
    validate(trigger: ValidationTrigger): Promise<boolean>;

    /**
     * Resets this validator to the default validity state.
     */
    reset(): void;
}

/**
 * Represents a base class from which all validator implementation must inherit.
 * Validators are custom elements that represent input validation requirements,
 * encapsulating the validation logic and the rendering of validation messages.
 */
// TODO: Use autoinject once https://github.com/aurelia/dependency-injection/pull/186 is released
@inject(Container)
export abstract class Validator implements IValidator
{
    /**
     * Creates a new instance of the type.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(container: Container)
    {
        this.element = container.get(Element) as HTMLElement;

        // Try to get the validation to which this validator belongs.
        if (container.hasResolver(ValidationCustomAttribute, true))
        {
            this.validation = container.get(ValidationCustomAttribute);
        }
    }

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * The validation to which this validator belongs,
     * or undefined if not associated with any validation.
     */
    protected readonly validation: ValidationCustomAttribute | undefined;

    /**
     * True to enable this validator, false to disable this validator,
     * or undefined to inherit the enabled state from the parent validation.
     *
     * If no parent validation exists, the computed default is true.
     *
     * Note that if the parent validation is disabled, this validator will
     * be disabled too, regardless of the value of this property.
     */
    @bindable({ defaultValue: undefined })
    public enabled: boolean | undefined;

    /**
     * True to validate on trigger events, false to not validate on trigger
     * events, or undefined to inherit the active state from the parent validation.
     *
     * If no parent validation exists, the computed default is null.
     *
     * Note that if the parent validation is inactive, this validator will
     * be inactive too, regardless of the value of this property.
     */
    @bindable({ defaultValue: undefined })
    public active: boolean | undefined;

    /**
     * The trigger to use for this validation, or undefined to
     * inherit the trigger from the parent validation.
     *
     * If no parent validation exists, the computed default is `input`.
     */
    @bindable({ defaultValue: undefined })
    public trigger: ValidationTrigger | undefined;

    /**
     * True if validation failed, false if validation succeeded,
     * or undefined if this validator is computed as disabled,
     * or if validation has not yet run.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public invalid: boolean | undefined;

    /**
     * The enabled state specified for this validator, or inherited from the parent validation.
     * If no enabled state is specified and no parent validation exists, the default is true.
     */
    @computedFrom("enabled", "validation.computedEnabled")
    public get computedEnabled(): boolean
    {
        if (this.validation != null)
        {
            if (!this.validation.computedEnabled)
            {
                return false;
            }

            if (this.enabled !== undefined)
            {
                return this.enabled;
            }

            return this.validation.computedEnabled;
        }

        if (this.enabled !== undefined)
        {
            return this.enabled;
        }

        return true;
    }

    /**
     * The active state specified for this validation, or inherited from the parent validation.
     * If no active state is specified and no parent validation exists, the default is true.
     */
    @computedFrom("active", "validation.computedActive")
    public get computedActive(): boolean
    {
        if (this.validation != null)
        {
            if (this.validation.computedActive === false)
            {
                return false;
            }

            if (this.active !== undefined)
            {
                return this.active;
            }

            return !!this.validation.computedActive;
        }

        if (this.active !== undefined)
        {
            return this.active;
        }

        return false;
    }

    /**
     * The trigger specified for this validator, or inherited from the parent validation.
     * If no trigger is specified and no parent validation exists, the default is `input`.
     */
    @computedFrom("trigger", "validation.computedTrigger")
    public get computedTrigger(): ValidationTrigger
    {
        if (this.trigger != null)
        {
            return this.trigger;
        }

        if (this.validation != null)
        {
            return this.validation.computedTrigger;
        }

        return "input";
    }

    /**
     * Called by the framework when the component is attached.
     * Attaches this validator to its parent validation, adds trigger event listeners,
     * and if this validation is computed as enabled and active, runs it immediately.
     * @returns A promise that will be resolved immediately, or when validation completes.
     */
    public async attached(): Promise<void>
    {
        if (this.validation != null)
        {
            this.validation.attachValidator(this);
        }

        if (this.computedEnabled && this.computedActive)
        {
            await this.validate("attached");
        }
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches this validator from its parent validation.
     */
    public detached(): void
    {
        if (this.validation != null)
        {
            this.validation.detachValidator(this);
        }
    }

    /**
     * Called by the validation when this validator should run.
     * @param reason The for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public abstract async validate(reason?: ValidationReason): Promise<boolean>;

    /**
     * Resets this validator to the default validity state, then updates the ancestor validations.
     */
    public reset(): void
    {
        this.invalid = undefined;

        if (this.validation != null)
        {
            this.validation.update();
        }

        // Note:
        // Changing the validity state will trigger the necessary tree update.
    }

    /**
     * Called by the framework when the `enabled` property changes.
     * Ensures the validator is reset if the value changes to false, and run
     * if the value changes to true and the `enabled` trigger is specified.
     */
    protected enabledChanged(): void
    {
        if (this.enabled)
        {
            if (this.computedEnabled && this.computedActive)
            {
                // tslint:disable-next-line: no-floating-promises
                this.validate("enabled");
            }
        }
        else
        {
            this.reset();
        }
    }

    /**
     * Called by the framework when the `invalid` property changes.
     * Calls `update` on the validation to which this validator belongs,
     * thereby propagating the change up the tree.
     */
    protected invalidChanged(): void
    {
        if (this.validation)
        {
            this.validation.update();
        }
    }
}
