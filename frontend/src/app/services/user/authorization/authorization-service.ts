import { autoinject } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { IdentityService } from "../identity";

/**
 * Represents the route settings that affect authorization.
 */
interface IRouteSettings
{
    /**
     * True if the user must be authenticated, otherwise false.
     */
    auth?: boolean;

    /**
     * The type of outfit the user must be associated with, if any.
     */
    outfit?: string;

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
     * Filters the specified routes to include only those available to the current visitor.
     * @param routes The routes to filter.
     * @returns The filtered routes.
     */
    public filterRoutes(routes: RouteConfig[]): RouteConfig[]
    {
        return routes.filter(route => this.isAuthorizedForRoute(route.settings));
    }

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

        if (routeSettings.auth)
        {
            if (identity == null)
            {
                return false;
            }
        }

        if (routeSettings.outfit != null)
        {
            if (identity == null || identity.outfit.type !== routeSettings.outfit)
            {
                return false;
            }
        }

        if (routeSettings.claims != null)
        {
            if (identity == null || !routeSettings.claims.every(role => identity.claims.has(role)))
            {
                return false;
            }
        }

        return true;
    }
}
