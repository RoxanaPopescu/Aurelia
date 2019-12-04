import { autoinject } from "aurelia-framework";
import { IdentityService } from "../identity";

/**
 * Represents the authorization settings for a route.
 */
interface IAuthorizationSettings
{
    /**
     * The outfit types, or sets of outfit types, of which at least one must be satisfied,
     * or undefined to authorize regardless of outfits.
     */
    outfits?: (string | string[])[];

    /**
     * The claims, or sets of claims, of which at least one must be satisfied,
     * or undefined to authorize regardless of claims.
     */
    claims?: (string | string[])[];
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
     * @param routeSettings The authorization settings associated with the route, all of which must be satisfied.
     * @returns True if authorized, otherwise false.
     */
    public isAuthorizedForRoute(routeSettings: (IAuthorizationSettings | undefined)[]): boolean
    {
        const identity = this._identityService.identity;

        for (const settings of routeSettings)
        {
            if (settings == null)
            {
                continue;
            }

            if (settings.outfits != null)
            {
                if (identity == null || !settings.outfits.some(o1 =>
                    o1 instanceof Array ? o1.every(o2 => identity.outfit.type.slug === o2) : identity.outfit.type.slug === o1))
                {
                    return false;
                }
            }

            if (settings.claims != null)
            {
                if (identity == null || !settings.claims.some(c1 =>
                    c1 instanceof Array ? c1.every(c2 => identity.claims.has(c2)) : identity.claims.has(c1)))
                {
                    return false;
                }
            }
        }

        return true;
    }
}
