import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Identity } from "./identity";

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
        this.apiClient = apiClient;
    }

    private readonly apiClient: ApiClient;
    private _identity: Identity | undefined;

    /**
     * The identity of the currently authenticated user, or undefined if not authenticated.
     */
    public get identity(): Identity | undefined
    {
        return this._identity;
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
        try
        {
            const response = await this.apiClient.post("identity/sign-in",
            {
                body: { email, password, remember }
            });

            this._identity = new Identity(response.data);

            return true;
        }
        catch (error)
        {
            this._identity = undefined;

            return false;
        }
    }

    /**
     * Attempts to reauthenticate the user using the authentication cookie stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether reauthentication succeeded.
     */
    public async reauthenticate(): Promise<boolean>
    {
        try
        {
            const response = await this.apiClient.post("identity/sign-in");

            this._identity = new Identity(response.data);

            return true;
        }
        catch (error)
        {
            this._identity = undefined;

            return false;
        }
    }

    /**
     * Unauthenticate the user, removing the authentication token stored on the device.
     * @returns A promise that will be resolved with a boolean indicating whether unauthentication succeeded.
     */
    public async unauthenticate(): Promise<boolean>
    {
        this._identity = undefined;

        await this.apiClient.post("identity/sign-out");

        // TODO: Call this if any request fails with a 401 status code?
        // TODO: Dispose the workspace in the container.

        return true;
    }
}
