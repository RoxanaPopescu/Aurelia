import { templateController, autoinject, BoundViewFactory, ViewSlot, bindable } from "aurelia-framework";
import { If } from "aurelia-templating-resources";
import { IdentityService } from "app/services/identity";

/**
 * Custom template controller attribute that conditionally renders the element to
 * which it is applied, based on whether the current user has the specified claims.
 */
@autoinject
@templateController
export class IfClaimsCustomAttribute extends If
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param boundViewFactory The `BoundViewFactory` instance for the element.
     * @param viewSlot The `ViewSlot` instance for the element.
     */
    public constructor(identityService: IdentityService, boundViewFactory: BoundViewFactory, viewSlot: ViewSlot)
    {
        super(boundViewFactory, viewSlot);

        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;
    private _bound = false;

    /**
     * The condition, represented as a comma-separated list of claims that must
     * be satisfied by the user, in order for the element to be rendered.
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
            else if (this._identityService.identity == null)
            {
                this.condition = false;
            }
            else
            {
                const requiredClaims = this.condition.split(/\s*,\s*/);
                const providedClaims = this._identityService.identity.claims;

                this.condition = requiredClaims.every((claim: string) => providedClaims.has(claim));
            }
        }
    }
}
