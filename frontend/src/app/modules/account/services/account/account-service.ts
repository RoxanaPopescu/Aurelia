import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IAccountInit } from "./account-init";

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
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Creates a new user with the specified name, email and password.
     * Note that the new user will initailly be unconfirmed.
     * @param accountInit The data for the new account.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(accountInit: IAccountInit): Promise<void>
    {
        await this._apiClient.post("user/create",
        {
            body: accountInit
        });
    }

    /**
     * Confirms the creation of a new user, by verifying the specified token.
     * @param token The token specified in the confirmation link sent to the new user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async confirmEmail(token: string): Promise<void>
    {
        await this._apiClient.post("user/confirm",
        {
            body: { token }
        });
    }

    /**
     * Requests password recovery for the user with the specified email.
     * @param email The email address identifying the user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async forgotPassword(email: string): Promise<void>
    {
        await this._apiClient.post("user/forgot-password",
        {
            body: { email }
        });
    }

    /**
     * Changes the password for the current user, or the user identified by the specified token.
     * @param password The new password chosen by the user.
     * @param token The token specified in the recovery link sent to the user, or undefined if already authenticated.
     * @returns A promise that will be resolved with the email of the user.
     */
    public async changePassword(password: string, token?: string): Promise<{ email: string }>
    {
        const result = await this._apiClient.post("user/change-password",
        {
            body: { password, token }
        });

        return result.data;
    }

    /**
     * Deletes the user with the specified email.
     * @param email The email address identifying the user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(email: string): Promise<void>
    {
        await this._apiClient.post("user/delete",
        {
            body: { email }
        });
    }
}
