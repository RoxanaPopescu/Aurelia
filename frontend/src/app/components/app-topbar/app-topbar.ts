import { autoinject } from "aurelia-framework";
import { IdentityService } from "app/services/identity";

/**
 * Represents the topbar of the app.
 */
@autoinject
export class AppTopbarCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
    }

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;
}
