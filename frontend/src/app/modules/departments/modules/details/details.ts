import { IdentityService } from "app/services/identity";
import { autoinject } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this.identityService = identityService;
        this.parentId = this.identityService.identity!.outfit!.id;
    }

    protected id: string;
    protected parentId: string;
    protected readonly identityService: IdentityService;

    public activate(params: any): void
    {
        this.id = params.id;
    }
}
