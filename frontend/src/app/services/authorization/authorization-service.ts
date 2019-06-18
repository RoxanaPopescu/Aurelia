import { autoinject } from "aurelia-framework";
import { IdentityService } from "../identity";

/**
 * Represents the route settings that affect authorization.
 */
interface IRouteSettings
{
    /**
     * The types of outfits the user must be associated with, if any.
     */
    outfits?: string[];

    /**
     * The claims the user must have, if any.
     */
    claims?: string[];
}

/**
 * Represents a service that supports various authorization needs.
 */
@autoinject
export class AuthorizationService
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;

    /**
     * Determines whether the visitor is authorized to access the route with the specified settings.
     * @param routeSettings The settings for the route to test.
     * @returns True if authorized, otherwise false.
     */
    public isAuthorizedForRoute(routeSettings: IRouteSettings | undefined): boolean
    {
        const identity = this._identityService.identity;

        if (routeSettings == null)
        {
            return true;
        }

        if (routeSettings.outfits != null && routeSettings.outfits.length > 0)
        {
            if (identity == null || !routeSettings.outfits.some(outfitType => identity.outfit.type.slug === outfitType))
            {
                return false;
            }
        }

        if (routeSettings.claims != null && routeSettings.claims.length > 0)
        {
            if (identity == null || !routeSettings.claims.every(role => identity.claims.has(role)))
            {
                return false;
            }
        }

        return true;
    }
}
