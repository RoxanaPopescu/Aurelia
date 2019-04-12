import { autoinject, bindable } from "aurelia-framework";
import { IdentityService } from "app/services/user/identity";

/**
 * Represents the identity of the currently authenticated user,
 * presented with picture and optionally preferred name.
 */
@autoinject
export class UserIdentityCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
    }

    protected readonly identityService: IdentityService;

    /**
     * The size of the component, where `icon` presents
     * only the picture, and `normal` presents both the
     * picture and the preferred name.
     */
    @bindable({ defaultValue: "normal" })
    public size: "icon" | "normal";
}
