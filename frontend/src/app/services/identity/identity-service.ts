import { autoinject } from "aurelia-framework";
import { Identity } from "./identity";
import { Profile } from "shared/src/model/profile";
import { Session } from "shared/src/model/session";
import { getUserClaims } from "legacy/helpers/identity-helper";
import settings from "resources/settings";
import { Log } from "shared/infrastructure";

/**
 * Represents a service that manages the authentication and identity of the user.
 */
@autoinject
export class IdentityService
{
    private _identity: Identity | undefined;

    /**
     * The identity of the currently authenticated user, or undefined if not authenticated.
     */
    public get identity(): Identity | undefined
    {
        if (!Profile.isAuthenticated || Session.userInfo == null)
        {
            if (this._identity != null)
            {
                this._identity = undefined;

                this.configureInfrastructure();
            }

            return undefined;
        }

        if (this._identity == null || this._identity.username !== Session.userInfo.username)
        {
            this._identity = new Identity(
            {
                username: Session.userInfo.username,
                fullName: Session.userInfo.fullName,
                preferredName: Session.userInfo.firstName,
                pictureUrl: undefined,
                outfit: Session.outfit,
                claims: getUserClaims(),
                tokens: Profile.tokens
            });

            this.configureInfrastructure();
        }

        return this._identity;
    }

    /**
     * Called when the user is authenticated, to configure the app.
     */
    public authenticated(): void
    {
        this.configureInfrastructure();
    }

    /**
     * Attempts to reauthenticate the user using the authentication cookie stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether reauthentication succeeded.
     */
    public async reauthenticate(): Promise<boolean>
    {
        try
        {
            await Profile.autoLogin();
        }
        finally
        {
            this.configureInfrastructure();
        }

        return Promise.resolve(this.identity != null);
    }

    /**
     * Unauthenticate the user, removing the authentication token stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether unauthentication succeeded.
     */
    public async unauthenticate(): Promise<boolean>
    {
        try
        {
            Profile.logout();
        }
        finally
        {
            this.configureInfrastructure();
        }

        return Promise.resolve(true);
    }

    /**
     * Configures the infrastructure.
     * Adds or removes the tokens to the set of default headers used by the `ApiClient`,
     * and sets the user associated with log entries.
     */
    private configureInfrastructure(): void
    {
        // tslint:disable: no-string-literal no-dynamic-delete
        if (this.identity != null)
        {
            settings.infrastructure.api.defaults!.headers!["authorization"] = `Bearer ${this.identity.tokens.access}`;
            settings.infrastructure.api.defaults!.headers!["refresh-token"] = this.identity.tokens.refresh;
            Log.setUsername(this._identity);
        }
        else
        {
            delete settings.infrastructure.api.defaults!.headers!["authorization"];
            delete settings.infrastructure.api.defaults!.headers!["refresh-token"];
            Log.setUsername(undefined);
        }
        // tslint:disable
    }
}
