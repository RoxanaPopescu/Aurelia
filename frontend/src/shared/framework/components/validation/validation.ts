import { Container, autoinject, bindable, bindingMode } from "aurelia-framework";
import { EventManager } from "shared/utilities";
import { Validator } from "./validator";
import { ValidationTrigger } from "./validation-trigger";

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
    __validationPromise?: Promise<boolean | undefined>
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
     * True if this validation is enabled, otherwise false.
     * Note that if false, all child validation will be considered
     * disabled too, even if their own enabled properties are true.
     */
    enabled: boolean | undefined;

    /**
     * The trigger to use for this validation, or undefined to
     * inherit the trigger specified on the parent validation.
     */
    trigger: ValidationTrigger | ValidationTrigger[] | undefined;

    /**
     * True if the validation failed, false if the validation succeded,
     * or undefined if not yet validated.
     */
    invalid: boolean | undefined;

    /**
     * Validate by running all validators attached to this validation tree.
     * Note that validators will only run for validations that are enabled,
     * with no disabled parent validator.
     * @param trigger The trigger that caused the validation to run.
     * @returns A promise that will be resolved with true if validation succeded,
     * false if validation failed, or undefined if this validator is disabled.
     */
    validate(): Promise<boolean | undefined>;

    /**
     * Resets the state of all validators within this validation tree,
     * and resets this validation to its default validity state.
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
     * Creates a new instance of the class.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(container: Container)
    {
        this.element = container.get(Element);

        if (container.parent.hasResolver(ValidationCustomAttribute, true))
        {
            this.parentValidation = container.parent.get(ValidationCustomAttribute);
        }
    }

    private readonly _eventManager = new EventManager(this);
    private _validationPromise: Promise<boolean | undefined> | undefined;

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
     * True if this validation, and all ancestor validations, are enabled, otherwise false.
     * If no parent validation exists, the default is true.
     */
    protected get computedEnabled(): boolean
    {
        return this.enabled || this.enabled === undefined && (this.parentValidation != null ? this.parentValidation.computedEnabled : true);
    }

    /**
     * The trigger specified for this validation, or inherited from a parent validation.
     * If not specified and no validation exists, the default is `none`.
     */
    protected get computedTrigger(): ValidationTrigger[]
    {
        const computedTriggers = this.trigger || (this.parentValidation != null ? this.parentValidation.computedTrigger : "none");

        return computedTriggers instanceof Array ? computedTriggers : [computedTriggers];
    }

    /**
     * True if this validation, or any child validations, are invalid, false if valid,
     * or undefined if this validation is disabled.
     */
    protected get computedInvalid(): boolean | undefined
    {
        if (this.enabled === false)
        {
            return undefined;
        }

        return this.invalid || this.childValidations.filter(v => v.enabled).some(v => !!v.computedInvalid) || this.validators.some(v => !!v.invalid);
    }

    /**
     * True if this validation is enabled, otherwise false.
     * Note that if false, all child validation will be considered
     * disabled too, even if their own enabled properties are true.
     */
    @bindable({ defaultValue: true })
    public enabled: boolean | undefined;

    /**
     * The trigger to use for this validation, or undefined to
     * inherit the trigger specified on the parent validation.
     */
    @bindable({ defaultValue: undefined })
    public trigger: ValidationTrigger | ValidationTrigger[] | undefined;

    /**
     * True if the validation failed, false if the validation succeded,
     * or undefined if not yet validated.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public invalid: boolean | undefined;

    /**
     * Called by the framework when the component is attached.
     * Attaches this validation to its parent validation and adds event listeners.
     */
    public attached(): void
    {
        if (this.parentValidation != null)
        {
            this.parentValidation.attachValidation(this);
        }

        this._eventManager.addEventListener(this.element, "input", event => this.onTriggerEvent(event, "input"));
        this._eventManager.addEventListener(this.element, "change", event => this.onTriggerEvent(event, "change"));
        this._eventManager.addEventListener(this.element, "focusout", event => this.onTriggerEvent(event, "blur"));
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches this validation from its parent validation and disposes all event listeners.
     */
    public detached(): void
    {
        if (this.parentValidation != null)
        {
            this.parentValidation.detachValidation(this);
        }

        this._eventManager.removeEventListeners();
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
    }

    /**
     * Validate by running all validators attached to this validation tree.
     * Note that validators will only run for validations that are enabled,
     * with no disabled parent validator.
     * @param trigger The trigger that caused the validation to run.
     * @returns A promise that will be resolved with true if validation succeded,
     * false if validation failed, or undefined if this validator is disabled.
     */
    public async validate(trigger: ValidationTrigger = "none"): Promise<boolean | undefined>
    {
        // Wait for any pending validation run to complete, to avoid a race condition.
        await this._validationPromise;

        // If this validation is enabled, start the validation run.
        if (this.computedEnabled)
        {
            // If a new validation promise has already been created, just return that.
            if (this._validationPromise != null)
            {
                return this._validationPromise;
            }

            // Assume validation is successful until proven otherwise.
            let invalid = false;

            // Get the computed trigger or triggers for this validation.
            const computedTrigger = this.computedTrigger;

            // Run the child validations and validators, collecting their promises.
            const validationPromises =
            [
                ...this.childValidations.map(v =>
                {
                    return v.validate(trigger);
                }),

                ...this.validators.map(v =>
                {
                    // Compute the effective triggers for the validator.
                    const triggers = v.trigger != null
                        ? v.trigger instanceof Array ? v.trigger : [v.trigger]
                        : computedTrigger instanceof Array ? computedTrigger : [computedTrigger];

                    const shouldValidate =

                        // Run if the validation run was triggered programatically.
                        // This ensures all validators run before a form is submitted.
                        trigger === "none" ||

                        // Run if the trigger matches a trigger specified on,
                        // or inherited by, the validator.
                        triggers.includes(trigger) ||

                        // Run if the validator is already in the invalid state, and the trigger
                        // specified on, or inherited by, the validator is not "none".
                        // This ensures the user gets immediate feedback when correcting an error,
                        // while still allowing validators to be configured to only run explicitly.
                        v.invalid && !triggers.includes("none");

                    if (shouldValidate)
                    {
                        return v.validate(trigger);
                    }

                    return Promise.resolve(!v.invalid);
                })
            ];

            // Store a promise for the pending validation run.
            this._validationPromise = Promise.all(validationPromises).then(validationResults =>
            {
                // Clear the stored promise.
                this._validationPromise = undefined;

                // If the validation run failed, mark this validation as invalid.
                if (validationResults.some(r => r === false))
                {
                    invalid = true;
                }

                // Update the state of the validation.
                this.invalid = invalid;

                return !this.invalid;
            });

            // Wait for the pending validation run to complete.
            return this._validationPromise;
        }

        return !this.invalid;
    }

    /**
     * Resets the state of all validators within this validation tree,
     * and resets this validation to its default validity state.
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
    }

    /**
     * Called by validators when their `invalid` state changes.
     * Updates the `invalid` state of this validator, then calls `update`
     * on the parant validation, thus propagating the change up the tree.
     */
    public update(): void
    {
        if (!this.computedEnabled)
        {
            this.invalid = false;
        }
        else
        {
            this.invalid =
                this.childValidations.filter(v => v.enabled).some(v => !!v.computedInvalid) ||
                this.validators.some(v => !!v.invalid);
        }

        if (this.parentValidation != null)
        {
            this.parentValidation.update();
        }
    }

    /**
     * Called by the framework when the `enabled` property changes.
     * Ensures the validation is reset if the value changes to false.
     */
    protected enabledChanged(): void
    {
        if (!this.enabled)
        {
            this.reset();
        }
    }

    /**
     * Called when a trigger event occurs.
     * Starts a new validation run, if this is the first validation to handle the event.
     * @param event The trigger event.
     * @param trigger The trigger that was activated by the event.
     */
    private onTriggerEvent(event: IValidationTriggerEvent, trigger: ValidationTrigger): void
    {
        if (event.__validationPromise == null)
        {
            event.__validationPromise = this.validate(trigger);
        }
    }
}
