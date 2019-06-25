import { Container, autoinject, bindable, bindingMode } from "aurelia-framework";
import { ValidationCustomAttribute } from "./validation";
import { ValidationTrigger } from "./validation-trigger";

import "./validator.scss";

/**
 * Represents a validator, associated with a validaqtion.
 *
 * This interface represents the public API of a validator, and
 * should be used as the type for any references to a validator
 * attribute instance.
 */
export interface IValidator
{
    /**
     * The trigger to use for this validator, or undefined to
     * inherit the trigger specified on the validation.
     */
    trigger: ValidationTrigger | ValidationTrigger[] | undefined;

    /**
     * True if the validation failed, false if validation succeeded,
     * or undefined if not yet validated.
     */
    invalid: boolean | undefined;

    /**
     * Called by the validation when this validator should run.
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    validate(trigger: ValidationTrigger): Promise<boolean>;

    /**
     * Resets this validator to its default validity state.
     */
    reset(): void;
}

/**
 * Represents a base class from which all validator implementation must inherit.
 * Validators are custom elements that represent input validation requirements,
 * encapsulating both validation logic and the rendering of validation messages.
 */
@autoinject
export abstract class Validator implements IValidator
{
    /**
     * Creates a new instance of the class.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(container: Container)
    {
        this.element = container.get(Element);

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
     * The trigger to use for this validator, or undefined to
     * inherit the trigger specified on the validation.
     */
    @bindable({ defaultValue: undefined })
    public trigger: ValidationTrigger | ValidationTrigger[] | undefined;

    /**
     * True if the validation failed, false if validation succeeded,
     * or undefined if not yet validated.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public invalid: boolean | undefined;

    /**
     * Called by the framework when the component is attached.
     * Attaches this validator to the validation.
     */
    public attached(): void
    {
        if (this.validation != null)
        {
            this.validation.attachValidator(this);
        }
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches this validator from the validation.
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
     * @param trigger The trigger that caused the validation to run.
     * @returns True if validation succeeded, otherwise false.
     */
    public abstract async validate(trigger: ValidationTrigger): Promise<boolean>;

    /**
     * Resets this validator to its default validity state.
     */
    public reset(): void
    {
        this.invalid = undefined;
    }

    /**
     * Called by the framework when the `invalid` property changes.
     * Calls `update` on the validation to which this validator belongs,
     * thus propagating the change up the tree.
     */
    protected invalidChanged(): void
    {
        if (this.validation)
        {
            this.validation.update();
        }
    }
}
