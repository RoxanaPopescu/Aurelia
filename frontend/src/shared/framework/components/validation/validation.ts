import { Container, autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { EventManager } from "shared/utilities";
import { Validator } from "./validator";
import { ValidationTrigger, ValidationReason } from "./validation-trigger";

/**
 * Represents an event that may trigger validation,
 * extended with validation specific state.
 */
interface IValidationTriggerEvent extends Event
{
    /**
     * The promise for the validation run triggered by this event,
     * or undefined if no validation has been triggered.
     */
    __validationPromise?: Promise<boolean | undefined>;
}

/**
 * Represents a controller for the validators within the element to
 * which it is applied, managing trigger event subscriptions and
 * aggregate validation state.
 *
 * This interface represents the public API of a validation, and
 * should be used as the type for any references to a validation
 * attribute instance.
 */
export interface IValidation
{
    /**
     * True to enable this validation, false to disable this validation,
     * or undefined to inherit the enabled state from the parent validation.
     *
     * If no parent validation exists, the computed default is true.
     *
     * Note that if the parent validation is disabled, this validation will
     * be disabled too, regardless of the value of this property.
     */
    enabled: boolean | undefined;

    /**
     * True to validate on trigger events, false to not validate on trigger
     * events, null to let child validations and validators decide themselves,
     * or undefined to inherit the active state from the parent validation.
     *
     * If no parent validation exists, the computed default is null.
     *
     * Note that if the parent validation is inactive, this validation will
     * be inactive too, regardless of the value of this property.
     */
    active: boolean | null | undefined;

    /**
     * The trigger to use for this validation, or undefined to
     * inherit the trigger from the parent validation.
     *
     * If no parent validation exists, the computed default is `input`.
     */
    trigger: ValidationReason | undefined;

    /**
     * True if validation failed, false if validation succeeded,
     * or undefined if this validation is computed as disabled,
     * or if validation has not yet run.
     */
    invalid: boolean | undefined;

    /**
     * Validate by running all validators attached to this validation subtree.
     * Note that validators will only run for validations that are enabled,
     * with no disabled parent validator.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation
     * succeeded, otherwise false.
     */
    validate(reason?: ValidationReason): Promise<boolean | undefined>;

    /**
     * Resets this validation and all child validations and validators
     * to the default validity state.
     */
    reset(): void;
}

/**
 * Represents a custom attribute, which acts as a controller for the
 * validators within the element to which it is applied, managing
 * trigger event subscriptions and aggregate validation state.
 */
@autoinject
export class ValidationCustomAttribute implements IValidation
{
    /**
     * Creates a new instance of the type.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(container: Container)
    {
        this.element = container.get(Element) as HTMLElement;

        // Try to get the parent validation of this validation.
        if (container.parent.hasResolver(ValidationCustomAttribute, true))
        {
            this.parentValidation = container.parent.get(ValidationCustomAttribute);
        }
    }

    private readonly _eventManager = new EventManager(this);
    private _validationPromise: Promise<boolean> | undefined;

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * The parent validation of this validation,
     * or undefined if no parent validation exists.
     */
    protected readonly parentValidation: ValidationCustomAttribute | undefined;

    /**
     * The child validations of this validation.
     */
    protected readonly childValidations: ValidationCustomAttribute[] = [];

    /**
     * The validators managed by this validation.
     */
    protected readonly validators: Validator[] = [];

    /**
     * True to enable this validation, false to disable this validation,
     * or undefined to inherit the enabled state from the parent validation.
     *
     * If no parent validation exists, the computed default is true.
     *
     * Note that if the parent validation is disabled, this validation will
     * be disabled too, regardless of the value of this property.
     */
    @bindable({ defaultValue: undefined })
    public enabled: boolean | undefined;

    /**
     * True to validate on trigger events, false to not validate on trigger
     * events, null to let child validations and validators decide themselves,
     * or undefined to inherit the active state from the parent validation.
     *
     * If no parent validation exists, the computed default is null.
     *
     * Note that if the parent validation is inactive, this validation will
     * be inactive too, regardless of the value of this property.
     */
    @bindable({ defaultValue: undefined })
    public active: boolean | null | undefined;

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
     * or undefined if this validation is computed as disabled,
     * or if validation has not yet run.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public invalid: boolean | undefined;

    /**
     * The enabled state specified for this validation, or inherited from the parent validation.
     * If no enabled state is specified and no parent validation exists, the default is true.
     */
    @computedFrom("enabled", "parentValidation.computedEnabled")
    public get computedEnabled(): boolean
    {
        if (this.parentValidation != null)
        {
            if (!this.parentValidation.computedEnabled)
            {
                return false;
            }

            if (this.enabled !== undefined)
            {
                return this.enabled;
            }

            return this.parentValidation.computedEnabled;
        }

        if (this.enabled !== undefined)
        {
            return this.enabled;
        }

        return true;
    }

    /**
     * The active state specified for this validation, or inherited from the parent validation.
     * If no active state is specified and no parent validation exists, the default is null.
     */
    @computedFrom("active", "parentValidation.computedActive")
    public get computedActive(): boolean | null
    {
        if (this.parentValidation != null)
        {
            if (this.parentValidation.computedActive === false)
            {
                return false;
            }

            if (this.active !== undefined)
            {
                return this.active;
            }

            return this.parentValidation.computedActive;
        }

        if (this.active !== undefined)
        {
            return this.active;
        }

        return null;
    }

    /**
     * The trigger specified for this validation, or inherited from the parent validation.
     * If no trigger is specified and no parent validation exists, the default is `input`.
     */
    @computedFrom("trigger", "parentValidation.computedTrigger")
    public get computedTrigger(): ValidationTrigger
    {
        if (this.trigger != null)
        {
            return this.trigger;
        }

        if (this.parentValidation != null)
        {
            return this.parentValidation.computedTrigger;
        }

        return "input";
    }

    /**
     * Called by the framework when the component is attached.
     * Attaches this validation to its parent validation, adds trigger event listeners,
     * and if this validation is computed as enabled and active, runs it immediately.
     * @returns A promise that will be resolved immediately, or when validation completes.
     */
    public async attached(): Promise<void>
    {
        if (this.parentValidation != null)
        {
            this.parentValidation.attachValidation(this);
        }

        this._eventManager.addEventListener(this.element, "input", event => this.onTriggerEvent(event));
        this._eventManager.addEventListener(this.element, "change", event => this.onTriggerEvent(event));

        if (this.computedEnabled && this.computedActive)
        {
            await this.validate("attached");
        }
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches this validation from its parent validation and disposes all event listeners.
     */
    public detached(): void
    {
        this._eventManager.removeEventListeners();

        if (this.parentValidation != null)
        {
            this.parentValidation.detachValidation(this);
        }
    }

    /**
     * Called when a child validation is attached.
     * Adds the specified validation as a child of this validation.
     * @param validation The child validation to attach.
     */
    public attachValidation(validation: ValidationCustomAttribute): void
    {
        this.childValidations.push(validation);
    }

    /**
     * Called when a child validation is detached.
     * Removes the specified validation as a child of this validation.
     * @param validation The child validation to detach.
     */
    public detachValidation(validation: ValidationCustomAttribute): void
    {
        this.childValidations.splice(this.childValidations.indexOf(validation), 1);
        this.update();
    }

    /**
     * Called when a validator is attached.
     * Adds the specified validator to this validation.
     * @param validation The validator to attach.
     */
    public attachValidator(validator: Validator): void
    {
        this.validators.push(validator);
    }

    /**
     * Called when a validator is detached.
     * Removes the specified validator from this validation.
     * @param validation The validator to remove.
     */
    public detachValidator(validator: Validator): void
    {
        this.validators.splice(this.validators.indexOf(validator), 1);
        this.update();
    }

    /**
     * Validate by running all validators attached to this validation subtree.
     * Note that validators will only run for validations that are enabled,
     * with no disabled parent validator.
     * @param reason The reason for the validation run.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    public async validate(reason?: ValidationReason): Promise<boolean>
    {
        const pendingValidationPromise = this._validationPromise;

        // Wait for any pending validation run to complete, to avoid a race condition.
        await pendingValidationPromise;

        // If this validation is computed as disabled, or if the trigger is an event and this
        // validation is computed as inactive, just return true.
        if (!this.computedEnabled)
        {
            return true;
        }

        // If a new validation promise was already created, just return that.
        // This happens if multiple `validate` calls were waiting for a
        // pending validation run to complete.
        if (this._validationPromise != null && this._validationPromise !== pendingValidationPromise)
        {
            return this._validationPromise;
        }

        // Assume validation is successful until proven otherwise.
        let invalid = false;

        // Run the child validations and validators, collecting their promises.
        const validationPromises =
        [
            ...this.childValidations.map(validation =>
            {
                return validation.validate(reason);
            }),

            ...this.validators.map(validator =>
            {
                const shouldValidate =

                    // Always run if the validation run was triggered programmatically.
                    reason == null && validator.computedEnabled ||

                    // Only run validators that are enabled and active in response to events.
                    validator.computedEnabled && validator.computedActive &&
                    (
                        // Run if the trigger matches a trigger specified on,
                        // or inherited by, the validator.
                        validator.computedTrigger === reason ||

                        // Run if the validator is already in the invalid state.
                        // This ensures immediate feedback when an error is corrected.
                        validator.invalid
                    );

                if (shouldValidate)
                {
                    return validator.validate(reason);
                }

                return Promise.resolve(!validator.invalid);
            })
        ];

        // Store a promise for the validation run.
        this._validationPromise = Promise.all(validationPromises)

            .then(validationResults =>
            {
                // Clear the stored promise.
                this._validationPromise = undefined;

                // If the validation run failed, mark this validation as invalid.
                if (validationResults.some(valid => !valid))
                {
                    invalid = true;
                }

                // Update the validity state of the validation.
                this.invalid = invalid;

                return !this.invalid;
            })

            .catch(error =>
            {
                // Ensure the validation promise is always cleared after it settles.
                this._validationPromise = undefined;

                throw error;
            });

        // Return the validation promise.
        return this._validationPromise;
    }

    /**
     * Resets this validation and all child validations and validators
     * to the default validity state, then updates the ancestor validations.
     */
    public reset(): void
    {
        for (const validation of this.childValidations)
        {
            validation.reset();
        }

        for (const validator of this.validators)
        {
            validator.reset();
        }

        this.invalid = undefined;

        // Note:
        // Resetting the validators will trigger the necessary tree update.
    }

    /**
     * Called by validators when their `invalid` state changes.
     * Queries the child validations and validators to update the `invalid` state of this validation,
     * then calls `update` on the parant validation, thereby propagating the change up the tree.
     */
    public update(): void
    {
        if (!this.computedEnabled)
        {
            this.invalid = undefined;
        }
        else
        {
            this.invalid =
                this.validators.filter(v => v.enabled !== false).some(v => !!v.invalid) ||
                this.childValidations.filter(v => v.enabled !== false).some(v => !!v.invalid);
        }

        if (this.parentValidation != null)
        {
            this.parentValidation.update();
        }
    }

    /**
     * Called by the framework when the `enabled` property changes.
     * Ensures the validation is reset if the value changes to false, and run
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
     * Called when a trigger event occurs.
     * Starts a new validation run, if this is the first validation to handle the event.
     * @param event The trigger event.
     */
    private onTriggerEvent(event: IValidationTriggerEvent): void
    {
        if (event.__validationPromise == null)
        {
            event.__validationPromise = this.validate(event.type as ValidationTrigger);
        }
    }
}
