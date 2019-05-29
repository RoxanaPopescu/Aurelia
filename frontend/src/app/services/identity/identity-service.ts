import { autoinject } from "aurelia-framework";
import { Identity } from "./identity";
import { Profile } from "shared/src/model/profile";
import { Session } from "shared/src/model/session";
import { getUserClaims } from "legacy/helpers/identity-helper";
import settings from "resources/settings";

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
        if (!Profile.isAuthenticated)
        {
            this._identity = undefined;

            return undefined;
        }

        return this._identity || new Identity(
        {
            username: Session.userInfo.username,
            fullName: Session.userInfo.fullName,
            preferredName: Session.userInfo.firstName,
            pictureUrl: undefined,
            outfit: Session.outfit,
            claims: getUserClaims(),
            tokens: Profile.tokens
        });
    }

    /**
     * Authenticates the specified user.
     * @param email The email identifying the user.
     * @param password The users password.
     * @param remember True to store the authentication cookie on the device, otherwise false.
     * @returns A promise that will be resolved with a boolean indicating whether authentication succeeded.
     */
    public async authenticate(email: string, password: string, remember = false): Promise<boolean>
    {
        throw new Error("Not implemented.");
    }

    /**
     * Attempts to reauthenticate the user using the authentication cookie stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether reauthentication succeeded.
     */
    public async reauthenticate(): Promise<boolean>
    {
        await Profile.autoLogin();

        this.configureApiClient();

        return Promise.resolve(this.identity != null);
    }

    /**
     * Unauthenticate the user, removing the authentication token stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether unauthentication succeeded.
     */
    public async unauthenticate(): Promise<boolean>
    {
        Profile.logout();

        this.configureApiClient();

        return Promise.resolve(true);
    }

    /**
     * Adds or removes the tokens to the set of default headers used by the `ApiClient`.
     */
    private configureApiClient(): void
    {
        // tslint:disable: no-string-literal no-dynamic-delete
        if (this.identity != null)
        {
            settings.infrastructure.api.defaults!.headers!["authorization"] = `Bearer ${this.identity.tokens.access}`;
            settings.infrastructure.api.defaults!.headers!["refresh-token"] = this.identity.tokens.refresh;
        }
        else
        {
            delete settings.infrastructure.api.defaults!.headers!["authorization"];
            delete settings.infrastructure.api.defaults!.headers!["refresh-token"];
        }
        // tslint:disable
    }
}
