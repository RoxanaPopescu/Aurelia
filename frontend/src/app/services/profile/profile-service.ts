import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Profile } from "./profile";

/**
 * Represents a service for managing user profiles.
 */
@autoinject
export class ProfileService
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
     * Gets the profile for the current user.
     * @returns A promise that will be resolved with the profile for the user.
     */
    public async get(): Promise<Profile>
    {
        const result = await this._apiClient.get("account/profile");

        return new Profile(result.data);
    }

    /**
     * Saves the profile for the current user.
     * @param profile The profile to save.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async save(profile: Partial<Profile>): Promise<void>
    {
        await this._apiClient.post("account/profile/save",
        {
            body:
            {
                ...profile,

                // TODO: This should take into account the baseUrl.
                confirmEmailUrl: `${location.protocol}//${location.host}/account/confirm-email?token={token}`
            }
        });
    }
}
