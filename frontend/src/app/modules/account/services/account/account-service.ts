import { IIdentityTokens } from "app/services/identity";
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
     * Note that the new user will initailly be unconfirmed, and that an
     * initial username will be automatically assigned, based on the name.
     * @param accountInit The data for the new account.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(accountInit: IAccountInit): Promise<void>
    {
        await Promise.resolve();

        throw new Error("Not implemented");
    }

    /**
     * Confirms the creation of a new user by verifying the specified token
     * and setting the specified password.
     * @param email The email address identifying the user.
     * @param password The new password chosen by the user.
     * @param token The token specified in the confirmation link sent to the new user.
     * @returns A promise that will be resolved with the identity tokens.
     */
    public async activate(email: string, password: string, token: string): Promise<IIdentityTokens>
    {
        const result = await this._apiClient.post("Activation",
        {
            body:
            {
                username: email,
                newPassword: password,
                activationCode: token
            }
        });

        return result.data;
    }

    /**
     * Requests password recovery for the user with the specified email.
     * @param email The email address identifying the user.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async forgotPassword(email: string): Promise<void>
    {
        await this._apiClient.post("RequestPasswordReset",
        {
            body:
            {
                username: email
            }
        });
    }

    /**
     * Changes the password for the specified user.
     * @param email The email address identifying the user.
     * @param password The new password chosen by the user.
     * @param token The token specified in the recovery link sent to the user.
     * @returns A promise that will be resolved with the identity tokens.
     */
    public async changePassword(email: string, password: string, token?: string): Promise<IIdentityTokens>
    {
        const result = await this._apiClient.post("ResetPassword",
        {
            body:
            {
                username: email,
                newPassword: password,
                token: token
            }
        });

        return result.data;
    }
}
