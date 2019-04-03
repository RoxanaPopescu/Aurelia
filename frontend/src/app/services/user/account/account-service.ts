import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";

/**
 * Represents a service for managing user accounts.
 */
@autoinject
export class AccountService
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

    /**
     * Determines whether a user with the specified username exists.
     * @param username The username identifying the user.
     * @returns A promise that will be resolved with a boolean indicating whether the user exists.
     */
    public async exists(username: string): Promise<boolean>
    {
        const result = await this.apiClient.head(`users/${username}`,
        {
            optional: true
        });

        return result.response.ok;
    }

    /**
     * Creates a new user with the specified name, email and password.
     * Note that the new user will initailly be unconfirmed.
     * @param password The password chosen by the user.
     * @param fullName The full name of the user.
     * @param preferredName The preferred name of the user.
     * @param email The email address identifying the new user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(password: string, fullName: string, preferredName: string, email: string): Promise<void>
    {
        await this.apiClient.post("users",
        {
            body: { password, fullName, preferredName, email }
        });
    }

    /**
     * Confirms the creation of a new user, by verifying the specified token.
     * @param username The username identifying the user.
     * @param token The token specified in the confirmation link sent to the new user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async confirm(username: string, token: string): Promise<void>
    {
        await this.apiClient.post(`users/${username}/confirm`,
        {
            body: { username, token }
        });
    }

    /**
     * Deletes the user with the specified username.
     * @param username The username identifying the user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(username: string): Promise<void>
    {
        await this.apiClient.delete(`users/${username}`);
    }
}
