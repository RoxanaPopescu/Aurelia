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
        await this._apiClient.post("account/create",
        {
            body:
            {
                ...accountInit,

                // TODO: This should take into account the baseUrl.
                confirmEmailUrl: `${location.protocol}//${location.host}/account/confirm-email?token={token}`
            }
        });
    }

    /**
     * Confirms the validity of the email identified by the specified token.
     * @param token The token specified in the confirmation link sent to the user.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async confirmEmail(token: string): Promise<void>
    {
        await this._apiClient.post("account/confirm-email",
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
        await this._apiClient.post("account/forgot-password",
        {
            body:
            {
                email,

                // TODO: This should take into account the baseUrl.
                changePasswordUrl: `${location.protocol}//${location.host}/account/change-password?token={token}`
            }
        });
    }

    /**
     * Changes the password for the user identified by the specified token.
     * @param token The token specified in the recovery link sent to the user.
     * @param newPassword The new password chosen by the user.
     * @returns A promise that will be resolved with the email of the user.
     */
    public async changePasswordUsingToken(token: string, newPassword: string): Promise<{ email: string }>
    {
        const result = await this._apiClient.post("account/change-password",
        {
            body: { token, newPassword }
        });

        return result.data;
    }

    /**
     * Changes the password for the current user.
     * @param currentPassword The current password for the user.
     * @param newPassword The new password chosen by the user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async changePasswordUsingCurrentPassword(currentPassword: string, newPassword: string): Promise<{ email: string }>
    {
        const result = await this._apiClient.post("account/change-password",
        {
            body: { currentPassword, newPassword }
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
        await this._apiClient.post("account/delete",
        {
            body: { email }
        });
    }
}
