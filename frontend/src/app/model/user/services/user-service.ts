import { autoinject } from "aurelia-framework";
import { ApiClient, ApiError, Log } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { UserInvite } from "../entities/user-invite";
import { User } from "../entities/user";

/**
 * Represents a service that manages users.
 */
@autoinject
export class UserService
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
     * Gets all users.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the users.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ users: User[]; userCount: number }>
    {
        const result = await this._apiClient.post("users/byOutfit",
        {
            signal
        });

        return {
            users: result.data.map(data => new User(data)),
            userCount: result.data.length
        };
    }

    /**
     * Gets the specified user.
     * @param userId The ID of the user to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the user.
     */
    public async get(userId: string, signal?: AbortSignal): Promise<User>
    {
        const result = await this._apiClient.post("users/details",
        {
            body: { userId },
            signal
        });

        return new User(result.data);
    }

    /**
     * Sends the specified user invite.
     * @param invite The invite to send.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async invite(invite: UserInvite): Promise<void>
    {
        try
        {
            await this._apiClient.post("createUser",
            {
                body: invite
            });
        }
        catch (error)
        {
            if (error instanceof ApiError && error.response != null)
            {
                if (error.response.status === 409)
                {
                    Log.error("User already exists");
                }

                if (error.response.status === 402)
                {
                    Log.error("Outfit does not exist");
                }
            }

            throw error;
        }
    }

    /**
     * Assigns the specified role to the specified user.
     * @param userId The ID of the user to which the role should be assigned.
     * @param roleId The ID of the role to assign.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async setRole(userId: string, roleId: string): Promise<void>
    {
        await this._apiClient.post("updateUserRole",
        {
            body: { userId, roleId }
        });
    }

    /**
     * Requests a password reset for the specified user.
     * @param userId The username of the user for which a password reset should be requested.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async resetPassword(username: string): Promise<void>
    {
        await this._apiClient.post("requestPasswordReset",
        {
            body: { username }
        });
    }

    /**
     * Deactivates the specified user.
     * @param username The username of the user to deactivate.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deactivate(username: string): Promise<void>
    {
        await this._apiClient.post("users/deactivate",
        {
            body: { username }
        });
    }
}
