import { autoinject, computedFrom } from "aurelia-framework";
import { Duration } from "luxon";
import { once } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { VehicleType } from "app/model/vehicle";
import { Identity, IdentityTokens, IIdentityTokens } from "./identity";
import settings from "resources/settings";

// Needed to ensure the legacy code still works.
import { Profile } from "shared/src/model/profile";
import { Session } from "shared/src/model/session";

export const moverOrganizationId = "2ab2712b-5f60-4439-80a9-a58379cce885";
export const coopOrganizationId = "573f5f57-a580-4c40-99b0-8fbeb396ebe9";

/**
 * Represents a function that will be invoked before the identity changes.
 * Use this to prepare the app for the new identity, if any.
 * @param newIdentity The new identity that was authenticated, if any.
 * @param oldIdentity The old identity that was unauthenticated, if any.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new identity.
 */
// tslint:disable-next-line: invalid-void
type IdentityChangeFunc = (newIdentity: Identity | undefined, oldIdentity: Identity | undefined) => void | Promise<void>;

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
    private _changeFunc: IdentityChangeFunc | undefined;

    /**
     * The identity of the currently authenticated user, or undefined if not authenticated.
     */
    @computedFrom("_identity")
    public get identity(): Identity | undefined
    {
        return this._identity;
    }

    /**
     * Configures the instance.
     * @param _changeFunc The function that is invoked before the identity changes.
     */
    @once
    public configure(identityChangeFunc?: IdentityChangeFunc): void
    {
        this._changeFunc = identityChangeFunc;

        // Validate each minute if the tokens are invalid, we have to do it this way since the setTimeout can fail
        setInterval(() => this.reauthorizeBeforeExpiry(), 60 * 1000);
    }

    /**
     * Authenticates the specified user.
     * @param email The email identifying the user.
     * @param password The users password.
     * @param remember True to store the auth tokens on the device, otherwise false.
     * @returns A promise that will be resolved with true if authentication succeeded, otherwise false.
     * @throws If the operation fails for any reason, other than invalid credentials.
     */
    public async authenticate(email: string, password: string, remember = false): Promise<boolean>
    {
        try
        {
            this.setTokens(undefined);

            const result = await this._apiClient.post("identity/authenticate",
            {
                body: { email, password },
                retry: 3
            });

            const tokens = new IdentityTokens({ remember, ...result.data });
            const identity = new Identity(result, tokens);

            await this._changeFunc?.(identity, this._identity);

            this.setTokens(tokens);
            this._identity = identity;

            return true;
        }
        catch (error)
        {
            if ([401, 403].includes(error.response?.status))
            {
                await this.unauthenticate();

                return false;
            }

            throw error;
        }
    }

    /**
     * Authorizes the user to access the specified organization.
     * @param organization The ID of the organization for which the user should be authorized.
     * @returns A promise that will be resolved with true if authorization succeeded, otherwise false.
     * @throws If the operation fails for any reason.
     */
    public async authorize(organizationId: string): Promise<boolean>
    {
        try
        {
            let tokens = this.getTokens();

            const result = await this._apiClient.post("identity/authorize",
            {
                body: { organizationId },
                retry: 3
            });

            tokens = new IdentityTokens({ ...tokens, ...result.data });
            const identity = new Identity(result, tokens);

            await this._changeFunc?.(identity, this._identity);

            this.setTokens(tokens);
            this._identity = identity;

            this.startLegacySession();

            return true;
        }
        catch (error)
        {
            if ([401, 403].includes(error.response?.status))
            {
                await this.unauthenticate();
            }

            throw error;
        }
    }

    /**
     * Attempts to reauthorize the user using the refresh token stored on the device.
     * @returns A promise that will be resolved with true if reauthorization succeeded, otherwise false.
     */
    public async reauthorize(): Promise<boolean>
    {
        try
        {
            let tokens = this.getTokens();

            if (tokens == null)
            {
                return false;
            }

            this.setTokens(tokens);

            const result = await this._apiClient.post("identity/reauthorize",
            {
                body: { refreshToken: tokens.refreshToken },
                retry: 3
            });

            tokens = new IdentityTokens({ ...tokens, ...result.data });

            if (this._identity != null)
            {
                this.setTokens(tokens);
            }
            else
            {
                const identity = new Identity(result, tokens);

                await this._changeFunc?.(identity, undefined);

                this.setTokens(tokens);
                this._identity = identity;

                if (this._identity.outfit != null)
                {
                    this.startLegacySession();
                }
            }

            return true;
        }
        catch (error)
        {
            if ([401, 403].includes(error.response?.status))
            {
                await this.unauthenticate();
            }
            else
            {
                console.error(error);
            }

            return false;
        }
    }

    /**
     * Unauthenticates the user, removing the authentication token stored on the device.
     * @returns A promise that will be resolved when the operation succeeds.
     * @throws If the operation fails for any reason.
     */
    public async unauthenticate(): Promise<void>
    {
        if (this._identity != null)
        {
            await this._changeFunc?.(undefined, this._identity);

            await this._apiClient.post("identity/unauthenticate",
            {
                body: { refreshToken: this._identity.tokens.refreshToken },
                retry: 3
            });

            this._identity = undefined;
        }

        this.setTokens(undefined);
    }

    /**
     * Gets the tokens to use.
     * @returns The tokens to use.
     */
    private getTokens(): IdentityTokens | undefined
    {
        let tokens =
        {
            accessToken: localStorage.getItem("access-token"),
            refreshToken: localStorage.getItem("refresh-token"),
            remember: true
        };

        if (!tokens.accessToken || !tokens.refreshToken)
        {
            tokens =
            {
                accessToken: sessionStorage.getItem("access-token"),
                refreshToken: sessionStorage.getItem("refresh-token"),
                remember: false
            };

            if (!tokens.accessToken || !tokens.refreshToken)
            {
                return undefined;
            }
        }

        try
        {
            return new IdentityTokens(tokens as IIdentityTokens);
        }
        catch (error)
        {
            console.error(error);

            this.setTokens(undefined);

            return undefined;
        }
    }

    /**
     * Sets the tokens to use.
     * @param tokens The tokens to use, or undefined to clear the tokens.
     */
    private setTokens(tokens: IdentityTokens | undefined): void
    {
        // tslint:disable: no-string-literal no-dynamic-delete

        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");

        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("refresh-token");

        delete settings.infrastructure.api.defaults!.headers!["authorization"];

        if (this._identity != null && tokens == null)
        {
            // This should never happen, but just to be sure.
            this._identity.tokens = undefined as any;
        }

        Profile.reset();

        if (tokens != null)
        {
            if (this._identity != null)
            {
                this._identity.tokens = tokens;
            }

            const storage = tokens.remember ? localStorage : sessionStorage;

            if (tokens.accessToken)
            {
                settings.infrastructure.api.defaults!.headers!["authorization"] = `Bearer ${tokens.accessToken}`;
                storage.setItem("access-token", tokens.accessToken);
            }
            else
            {
                delete settings.infrastructure.api.defaults!.headers!["authorization"];
            }

            if (tokens.refreshToken)
            {
                storage.setItem("refresh-token", tokens.refreshToken);
            }

            Profile.setTokens(tokens.accessToken, tokens.refreshToken);
        }

        // tslint:disable
    }

    /**
     * Reauthorizes if the access token is about to expire.
     */
    private reauthorizeBeforeExpiry(): void
    {
        const tokens = this.identity?.tokens;

        if (tokens != null)
        {
            const padding = Duration.fromObject({ minutes: 2 });
            const expires = tokens.accessTokenExpires != null && tokens.accessTokenExpires.diffNow().minus(padding).valueOf();

            if (expires < 0)
            {
                this.reauthorize();
            }
        }
    }

    /**
     * Starts the session in the legacy code.
     */
    private startLegacySession(): void
    {
        Session.startNew(this.identity!, VehicleType.getAll());
    }
}
