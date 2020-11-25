import { autoinject } from "aurelia-framework";
import { Identity } from "./identity";
import { Profile } from "shared/src/model/profile";
import { Session } from "shared/src/model/session";
import { getUserClaims, getAccessTokenExpireDuration } from "legacy/helpers/identity-helper";
import settings from "resources/settings";
import { Log, ApiClient } from "shared/infrastructure";
import { Duration, DateTime } from "luxon";

/**
 * Represents a service that manages the authentication and identity of the user.
 */
@autoinject
export class IdentityService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;
    private _identity: Identity | undefined;
    private _refreshTokenTimeout: any;
    private _lastReauthenticate: DateTime | undefined;

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
        // Update tokens in identity
        if (Profile.tokens != null && this.identity != null)
        {
            this.identity.tokens = Profile.tokens;
        }

        this.configureInfrastructure();
        this.verifyAccessTokenExpireDate();
    }

    /**
     * Attempts to start the session for logged in users
     * @returns A promise that will be resolved with a boolean indicating whether reauthentication succeeded.
     */
    public async startSession(): Promise<boolean>
    {
        try
        {
            await Profile.autoLogin();
        }
        finally
        {
            this.authenticated();
        }

        return Promise.resolve(this.identity != null);
    }

    /**
     * Attempts to reauthenticate the user using the authentication cookie stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether reauthentication succeeded.
     */
    public async reauthenticate(): Promise<boolean>
    {
        // Verify a minimum of 1 minutes since last reauthenticate (It can continiously call if tokens are not set correctly)
        if (this._lastReauthenticate != null && DateTime.local().diff(this._lastReauthenticate).get("milliseconds") < 1000 * 60)
        {
            return Promise.resolve(false);
        }

        try
        {
            this._lastReauthenticate = DateTime.local();
            const result = await this._apiClient.get("RefreshTokens");
            Profile.setTokens(result.data.accessToken, result.data.refreshToken);
        }
        catch
        {
            // For now we do nothing
        }
        finally
        {
            this.authenticated();
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
            this._lastReauthenticate = undefined;
            clearTimeout(this._refreshTokenTimeout);
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
            Log.setUser(this._identity);
        }
        else
        {
            delete settings.infrastructure.api.defaults!.headers!["authorization"];
            delete settings.infrastructure.api.defaults!.headers!["refresh-token"];
            Log.setUser(undefined);
        }
        // tslint:disable
    }

    /**
     * Verifies the access token's expire date
     * This will also call a new re-authentication one minute before expiring.
     */
    private verifyAccessTokenExpireDate(): void
    {
        clearTimeout(this._refreshTokenTimeout);

        if (this.identity?.tokens == null)
        {
            return;
        }

        const expires = getAccessTokenExpireDuration(this.identity.tokens.access);
        const refreshBeforeExpire = Duration.fromMillis(1000 * 60 * 1);
        const refresh = expires.minus(refreshBeforeExpire);

        this._refreshTokenTimeout = setTimeout(
            () => this.reauthenticate(),
            refresh.get("milliseconds")
        );
    }
}
