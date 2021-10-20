import { autoinject, computedFrom } from "aurelia-framework";
import { Duration } from "luxon";
import { delay, once } from "shared/utilities";
import { ApiClient, ApiResult, Log } from "shared/infrastructure";
import { VehicleType } from "app/model/vehicle";
import { IdentityTokens, IIdentityTokens } from "./identity-tokens";
import { Identity } from "./identity";
import settings from "resources/settings";

// Needed to ensure the legacy code still works.
import { Profile } from "shared/src/model/profile";
import { Session } from "shared/src/model/session";

export const moverOrganizationId = "2ab2712b-5f60-4439-80a9-a58379cce885";
export const coopOrganizationId = "573f5f57-a580-4c40-99b0-8fbeb396ebe9";

/**
 * Represents a function that will be called before the identity changes.
 * Use this to prepare the app for the new identity, if any.
 * @param newIdentity The new identity that was authenticated, if any.
 * @param oldIdentity The old identity that was unauthenticated, if any.
 * @param finish A function that, if called, finishes the change immediately.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new identity.
 */
type IdentityChangeFunc = (newIdentity: Identity | undefined, oldIdentity: Identity | undefined, finish: () => void) => void | Promise<void>;

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

        // Reauthorize whenever the page becomes visible.
        document.addEventListener("visibilitychange", async () =>
        {
            if (document.visibilityState !== "hidden")
            {
                await this.reauthorizeBeforeExpiry();
            }
        });

        // Continuously check whether the tokens are approaching expiry, and reauthorize if nessesary.
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

            let finished = false;

            const finishFunc = () =>
            {
                this.setTokens(tokens);
                this._identity = identity;
                Profile.organizationId = identity.organization?.id;
                finished = true;
            };

            await this._changeFunc?.(identity, this._identity, finishFunc);

            if (!finished)
            {
                finishFunc();
            }

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
     * @param retry True to keep retrying for a while, even if authorization is denied.
     * Use this when authorizing immediately after requesting the creation of an organization.
     * @returns A promise that will be resolved with true if authorization succeeded, otherwise false.
     * @throws If the operation fails for any reason.
     */
    public async authorize(organizationId: string, retry = false): Promise<boolean>
    {
        try
        {
            let tokens = this.getTokens();

            let result: ApiResult = undefined as any;

            for (let attempt = 30; attempt >= 1; attempt--)
            {
                try
                {
                    result = await this._apiClient.post("identity/authorize",
                    {
                        body: { organizationId },
                        retry: 3
                    });

                    break;
                }
                catch (error)
                {
                    if (!retry || attempt === 1 || error.response?.status !== 401)
                    {
                        throw error;
                    }

                    await delay(1000);
                }
            }

            tokens = new IdentityTokens({ ...tokens, ...result.data });
            const identity = new Identity(result, tokens);

            let finished = false;

            const finishFunc = () =>
            {
                this.setTokens(tokens);
                this._identity = identity;

                this.startLegacySession();

                finished = true;
            };

            await this._changeFunc?.(identity, this._identity, finishFunc);

            if (!finished)
            {
                finishFunc();
            }

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
     * @param unauthorizeOnFailure True to unauthorize if reauthorization fails, otherwise false.
     * @returns A promise that will be resolved with true if reauthorization succeeded, otherwise false.
     */
    public async reauthorize(unauthorizeOnFailure = true): Promise<boolean>
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

            const identity = new Identity(result, tokens);

            let finished = false;

            const finishFunc = () =>
            {
                const shouldStartLegacySession = this._identity == null && identity.organization != null;

                this.setTokens(tokens);
                this._identity = identity;
                Profile.organizationId = identity.organization?.id;

                if (shouldStartLegacySession)
                {
                    this.startLegacySession();
                }

                finished = true;
            };

            await this._changeFunc?.(identity, undefined, finishFunc);

            if (!finished)
            {
                finishFunc();
            }

            return true;
        }
        catch (error)
        {
            if ([401, 403].includes(error.response?.status))
            {
                console.warn(error);

                if (unauthorizeOnFailure)
                {
                    await this.unauthenticate();
                }
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
            const refreshToken = this._identity.tokens.refreshToken;

            let finished = false;

            const finishFunc = () =>
            {
                this._identity = undefined;
                finished = true;
            };

            await this._changeFunc?.(undefined, this._identity, finishFunc);

            if (!finished)
            {
                finishFunc();
            }

            try
            {
                await this._apiClient.post("identity/unauthenticate",
                {
                    body: { refreshToken },
                    retry: 3
                });
            }
            catch (error)
            {
                Log.error("Could not revoke access tokens", error);
            }
        }

        this.setTokens(undefined);
    }

    /**
     * Verifies that the specified password matches the password for the current user.
     * @param password The users password.
     * @returns A promise that will be resolved with true if the password is valid, otherwise false.
     */
    public async verifyPassword(password: string): Promise<boolean>
    {
        try
        {
            await this._apiClient.post("identity/verify-password",
            {
                body: { password },
                retry: 3
            });

            return true;
        }
        catch (error)
        {
            if ([401, 403].includes(error.response?.status))
            {
                return false;
            }

            throw error;
        }
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

            Profile.setTokens(tokens.accessToken, tokens.refreshToken, this._identity?.claims);
        }
        else
        {
            Profile.reset();
        }

        // tslint:disable
    }

    /**
     * Reauthorizes if the access token is about to expire.
     */
    private async reauthorizeBeforeExpiry(): Promise<void>
    {
        const tokens = this.getTokens();

        if (tokens != null)
        {
            const padding = Duration.fromObject({ minutes: 5 });
            const expires = tokens.accessTokenExpires?.diffNow().minus(padding).valueOf();

            if (expires && expires < 0)
            {
                // HACK: Don't unauthorize on failure, as it screws things up when multiple tabs are open.
                await this.reauthorize(false);
            }
        }
    }

    /**
     * Starts the session in the legacy code.
     */
    private startLegacySession(): void
    {
        Session.startNew(this._identity!, VehicleType.getAll());
    }
}
