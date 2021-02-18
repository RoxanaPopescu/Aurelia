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
    private _refreshTokenTimeouthandle: any;

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

            this.setTokens({ ...result.data, remember });

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
        const tokens = this.getTokens();

        if (tokens == null)
        {
            return false;
        }

        try
        {
            this.setTokens(tokens);

            if (this.identity != null)
            {
                const result = await this._apiClient.get("refreshtokens",
                {
                    retry: 3
                });

                this.setTokens(new IdentityTokens({ ...result.data, remember: tokens.remember }));
            }
            else
            {
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
            }

            return true;
        }
        catch (error)
        {
            await this.unauthenticate();

            if (error.response == null || ![401, 403].includes(error.response.status))
            {
                console.error(error);
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

        this.scheduleReauthentication(tokens);

        // tslint:disable
    }

    /**
     * Schedules a reauthentication before the current tokens expire.
     * @param tokens The current tokens, for which reauthentication should be scheduled.
     */
    private scheduleReauthentication(tokens?: IdentityTokens): void
    {
        clearTimeout(this._refreshTokenTimeouthandle);

        if (tokens?.expires != null)
        {
            const padding = Duration.fromObject({ minutes: 1 });
            const timeout = tokens.expires.diffNow().minus(padding).as("milliseconds");

            if (timeout > 0)
            {
                this._refreshTokenTimeouthandle = setTimeout(() => this.reauthenticate(), timeout);
            }
        }
    }
}
