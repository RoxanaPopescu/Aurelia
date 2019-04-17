import { autoinject } from "aurelia-framework";
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
}
