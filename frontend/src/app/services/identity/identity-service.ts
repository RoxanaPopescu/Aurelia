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
import { OrganizationInfo } from "app/model/organization";

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
    private _organization: any | undefined;
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
     * The currently selected organization, or undefined if no organization is selected.
     */
    @computedFrom("_organization")
    public get organization(): OrganizationInfo | undefined
    {
        return this._organization;
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
        setInterval(() => this.checkReauthentication(), 60 * 1000);
    }

    /**
     * Called when authentication is completed as part of account activation or password recovery.
     * @param tokens The tokens to use.
     * @returns A promise that will be resolved with true if authentication succeeded, otherwise false.
     */
    public async authenticated(tokens: IIdentityTokens): Promise<boolean>
    {
        this.setTokens(new IdentityTokens(tokens));

        return this.reauthenticate();
    }

    /**
     * Authenticates the specified user.
     * @param username The username identifying the user.
     * @param password The users password.
     * @param remember True to store the auth tokens on the device, otherwise false.
     * @returns A promise that will be resolved with true if authentication succeeded, otherwise false.
     * @throws If the operation fails for any reason, other than invalid credentials.
     */
    public async authenticate(username: string, password: string, remember = false): Promise<boolean>
    {
        try
        {
            this.setTokens(undefined);

            const result = await this._apiClient.post("login",
            {
                body: { username, password, remember },
                retry: 3
            });

            this.setTokens(new IdentityTokens({ ...result.data, remember }));

            return this.reauthenticate();
        }
        catch (error)
        {
            await this.unauthenticate();

            if (error.response == null || ![401, 403].includes(error.response.status))
            {
                throw error;
            }

            return false;
        }
    }

    /**
     * Attempts to reauthenticate the user using the authentication cookie stored on the device.
     * @returns A promise that will be resolved with true if authentication succeeded, otherwise false.
     */
    public async reauthenticate(): Promise<boolean>
    {
        let tokens = this.getTokens();

        if (tokens == null)
        {
            return false;
        }

        try
        {
            this.setTokens(tokens);

            // Verify if we need to update the tokens.
            const padding = Duration.fromObject({ minutes: 2 });

            if (tokens.accessTokenExpires.diffNow().minus(padding).as("seconds") < 0)
            {
                // Allow re-authenticate if refresh token is still valid.
                if (tokens.refreshTokenExpires.diffNow().as("seconds") > 0)
                {

                    const refreshResult = await this._apiClient.get("refreshtokens",
                    {
                        retry: 3
                    });

                    tokens = new IdentityTokens({ ...refreshResult.data, remember: tokens.remember });
                    this.setTokens(tokens);
                }
                else
                {
                    await this.unauthenticate();

                    return false;
                }
            }

            // Start session
            const result = await this._apiClient.post("session/start",
            {
                retry: 3
            });

            const identity = new Identity(result, tokens);

            await this._changeFunc?.(identity, this._identity);

            this.setTokens(identity.tokens);
            this._identity = identity;

            VehicleType.setAll(result.data.vehicleTypes.map(t => new VehicleType(t)));

            await Session.start(result);

            return true;
        }
        catch (error)
        {
            if (error.response != null && ![401, 403].includes(error.response.status))
            {
                await this.unauthenticate();
            }
            else
            {
                await this.unauthenticate();
            }

            return false;
        }
    }

    /**
     * Authorizes the user to access the specified organization.
     * @param organization The organization for which the user should be authorized.
     * @returns A promise that will be resolved with true if authorization succeeded, otherwise false.
     * @throws If the operation fails for any reason.
     */
    public async authorize(organization: OrganizationInfo): Promise<boolean>
    {
        try
        {
            const remember = this.getTokens()?.remember;

            // TODO: Call the correct endpoint, once supported; until then, we just refresh the tokens.

            const result = await this._apiClient.get("refreshtokens",
            {
                retry: 3
            });

            // const result = await this._apiClient.post("identity/authorize",
            // {
            //     body: { organizationId: organization.id },
            //     retry: 3
            // });

            this.setTokens(new IdentityTokens({ ...result.data, remember }));

            this._organization = organization;

            return this.reauthenticate();
        }
        catch (error)
        {
            await this.unauthenticate();

            if (error.response == null || ![401, 403].includes(error.response.status))
            {
                throw error;
            }

            return false;
        }
    }

    /**
     * Unauthenticates the user, removing the authentication token stored on the device.
     * @returns A promise that will be resolved with true if unauthentication succeeded, otherwise false.
     * @throws If the request fails for any reason.
     */
    public async unauthenticate(): Promise<boolean>
    {
        this.setTokens(undefined);

        this._organization = undefined;

        if (this._identity != null)
        {
            await this._changeFunc?.(undefined, this._identity);

            this._identity = undefined;
        }

        return true;
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
     * Sets the tokens to use and schedules a reauthentication before they expire.
     * @param tokens The tokens to use, or undefined to clear the tokens.
     */
    private setTokens(tokens?: IdentityTokens): void
    {
        // tslint:disable: no-string-literal no-dynamic-delete

        localStorage.removeItem("access-token");
        sessionStorage.removeItem("access-token");

        localStorage.removeItem("refresh-token");
        sessionStorage.removeItem("refresh-token");

        delete settings.infrastructure.api.defaults!.headers!["authorization"];
        delete settings.infrastructure.api.defaults!.headers!["refresh-token"];

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
                settings.infrastructure.api.defaults!.headers!["refresh-token"] = tokens.refreshToken;
                storage.setItem("refresh-token", tokens.refreshToken);
            }
            else
            {
                delete settings.infrastructure.api.defaults!.headers!["refresh-token"];
            }

            Profile.setTokens(tokens.accessToken, tokens.refreshToken);
        }

        // tslint:disable
    }

    /**
     * Schedules a reauthentication before the current tokens expire.
     * @param tokens The current tokens, for which reauthentication should be scheduled.
     */
    private checkReauthentication(): void
    {
        const tokens = this.identity?.tokens;

        if (tokens == null)
        {
            return;
        }

        const padding = Duration.fromObject({ minutes: 2 });
        const expires = tokens.accessTokenExpires.diffNow().minus(padding).as("seconds");

        if (expires < 0)
        {
            this.reauthenticate();
        }
    }
}
