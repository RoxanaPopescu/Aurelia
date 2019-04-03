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
        this.apiClient = apiClient;
    }

    private readonly apiClient: ApiClient;

    /**
     * Gets the profile for the user with the specified username.
     * @param username The username identifying the user.
     * @returns A promise that will be resolved with the profile for the user.
     */
    public async get(username: string): Promise<Profile>
    {
        const result = await this.apiClient.get(`users/${username}/profile`);

        return new Profile(result.data);
    }

    /**
     * Saves the changes made to the specified profile.
     * @param profile The profile to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async save(profile: Profile): Promise<void>
    {
        await this.apiClient.put(`users/${profile.username}/profile`,
        {
            body: profile
        });
    }
}
