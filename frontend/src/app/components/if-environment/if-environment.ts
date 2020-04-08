import { templateController, autoinject, BoundViewFactory, ViewSlot, bindable } from "aurelia-framework";
import { If } from "aurelia-templating-resources";

/**
 * Custom template controller attribute that conditionally renders the element to
 * which it is applied, based on whether the current environment matches one of
 * the specified environments.
 */
@autoinject
@templateController
export class IfEnvironmentCustomAttribute extends If
{
    /**
     * Creates a new instance of the type.
     * @param boundViewFactory The `BoundViewFactory` instance for the element.
     * @param viewSlot The `ViewSlot` instance for the element.
     */
    public constructor(boundViewFactory: BoundViewFactory, viewSlot: ViewSlot)
    {
        super(boundViewFactory, viewSlot);
    }

    private _bound = false;

    /**
     * The condition, represented as a comma-separated list of environments
     * of which one must match, in order for the element to be rendered.
     */
    @bindable({ primaryProperty: true })
    public condition: boolean  | string;

    /**
     * The swap order to use.
     */
    @bindable
    public swapOrder: "before" | "with" | "after";

    /**
     * The caching option to use.
     */
    @bindable
    public cache: boolean | string = true;

    /**
     * Called by the framework when the component is binding.
     * @param bindingContext The binding context
     * @param overrideContext The override context.
     */
    public bind(bindingContext: any, overrideContext: any): void
    {
        this.updateCondition();

        super.bind(bindingContext, overrideContext);

        this._bound = true;
    }

    /**
     * Called by the framework when the component is unbinding.
     */
    public unbind(): void
    {
        this._bound = false;
    }

    /**
     * Called by the framework when the `condition` property changes.
     * @param newValue The new value.
     */
    public conditionChanged(newValue: any): void
    {
        if (this._bound)
        {
            this.updateCondition();

            super.conditionChanged(newValue);
        }
    }

    /**
     * Resolves and updates the value of the `condition` property.
     */
    private updateCondition(): void
    {
        if (typeof this.condition === "string")
        {
            if (!this.condition || !this.condition.trim())
            {
                this.condition = true;
            }
            else
            {
                const requiredEnvironmants = this.condition.split(/\s*,\s*/);
                const currentEnvironmants = ENVIRONMENT.name;

                this.condition = requiredEnvironmants.includes(currentEnvironmants);
            }
        }
    }
}