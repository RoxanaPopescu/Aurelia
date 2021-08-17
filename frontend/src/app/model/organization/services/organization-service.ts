import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { OrganizationInfo } from "../entities/organization-info";
import { IOrganizationInit } from "../entities/organization-init";
import { OrganizationProfile } from "../entities/organization-profile";
import { OrganizationUser } from "../entities/organization-user";
import { OrganizationRole } from "../entities/organization-role";
import { OrganizationTeam } from "../entities/organization-team";
import { IOrganizationUserInvite } from "../entities/organization-user-invite";
import { OrganizationPermission } from "../entities/organization-permission";

/**
 * Represents a service for managing organizations.
 */
@autoinject
export class OrganizationService
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
     * Creates a new organization.
     * @param organizationInit The data for the new organization.
     * @returns A promise that will be resolved with info about the organization.
     */
    public async create(organizationInit: IOrganizationInit): Promise<OrganizationInfo>
    {
        const result = await this._apiClient.post("organizations/create",
        {
            body: organizationInit
        });

        return new OrganizationInfo(result.data);
    }

    /**
     * Gets all organizations visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with info about the organizations.
     */
    public async getAll(signal?: AbortSignal): Promise<OrganizationInfo[]>
    {
        const result = await this._apiClient.get("organizations",
        {
            signal
        });

        return result.data.map((data: any) => new OrganizationInfo(data));
    }

    /**
     * Deletes the specified organization.
     * @param organizationId The ID of the organization.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(organizationId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/delete`);
    }

    /**
     * Gets the profile for the specified organization.
     * @param organizationId The ID of the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the profile for the organization.
     */
    public async getProfile(organizationId: string, signal?: AbortSignal): Promise<OrganizationProfile>
    {
        const result = await this._apiClient.get(`organizations/${organizationId}/profile`,
        {
            signal
        });

        return new OrganizationProfile(result.data);
    }

    /**
     * Updates the profile for the specified organization.
     * @param organizationId The ID of the organization.
     * @param profile The profile to save.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async updateProfile(organizationId: string, profile: OrganizationProfile): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/profile/update`,
        {
            body: profile
        });
    }

    /**
     * Gets the users within the specified organization.
     * @param organizationId The ID of the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the users within the organization.
     */
    public async getUsers(organizationId: string, signal?: AbortSignal): Promise<OrganizationUser[]>
    {
        const result = await this._apiClient.get(`organizations/${organizationId}/users`,
        {
            signal
        });

        return result.data.map(user => new OrganizationUser(user));
    }

    /**
     * Invites the specified user to the specified organization.
     * @param organizationId The ID of the organization.
     * @param invite The invite to send.
     * @returns A promise that will be resolved with the new user.
     */
    public async inviteUser(organizationId: string, invite: IOrganizationUserInvite): Promise<OrganizationUser>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/users/invite`,
        {
            body: invite
        });

        return new OrganizationUser(result.data);
    }

    /**
     * Resends the invite for the specified user to the specified organization.
     * @param organizationId The ID of the organization.
     * @param userId The ID of the user to invite.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async resendInvite(organizationId: string, userId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/users/${userId}/reinvite`);
    }

    /**
     * Removes the specified user from the specified organization.
     * @param organizationId The ID of the organization.
     * @param userId The ID of the user to remove.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async removeUser(organizationId: string, userId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/users/${userId}/remove`);
    }

    /**
     * Gets the permissions that may be assigned to a role.
     * @param organizationId The ID of the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the permissions.
     */
     public async getPermissions(organizationId: string, signal?: AbortSignal): Promise<OrganizationPermission[]>
     {
         const result = await this._apiClient.get(`organizations/${organizationId}/permissions`,
         {
             signal
         });

         return result.data.map(permission => new OrganizationPermission(permission));
     }

    /**
     * Gets the roles within the specified organization.
     * @param organizationId The ID of the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the roles within the organization.
     */
    public async getRoles(organizationId: string, signal?: AbortSignal): Promise<OrganizationRole[]>
    {
        const result = await this._apiClient.get(`organizations/${organizationId}/roles`,
        {
            signal
        });

        return result.data.map(role => new OrganizationRole(role));
    }

    /**
     * Creates the specified role within the specified organization.
     * @param organizationId The ID of the organization.
     * @param role The role to create.
     * @returns A promise that will be resolved with the new role.
     */
    public async createRole(organizationId: string, role: OrganizationRole): Promise<OrganizationRole>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/roles/create`,
        {
            body: role
        });

        return new OrganizationRole(result.data);
    }

    /**
     * Updates the specified role within the specified organization.
     * @param organizationId The ID of the organization.
     * @param role The role to save.
     * @returns A promise that will be resolved with the new role.
     */
    public async updateRole(organizationId: string, role: OrganizationRole): Promise<OrganizationRole>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/roles/${role.id}/update`,
        {
            body: role
        });

        return new OrganizationRole(result.data);
    }

    /**
     * Deletes the specified role within the specified organization.
     * @param organizationId The ID of the organization.
     * @param roleId The ID of the role to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteRole(organizationId: string, roleId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/roles/${roleId}/delete`);
    }

    /**
     * Creates a new role as a dublicate of the specified role.
     * @param organizationId The ID of the organization.
     * @param roleId The ID of the role to dublicate.
     * @returns A promise that will be resolved with the new role.
     */
    public async duplicateRole(organizationId: string, roleId: string): Promise<OrganizationRole>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/roles/${roleId}/dublicate`);

        return new OrganizationRole(result.data);
    }

    /**
     * Gets the teams within the specified organization.
     * @param organizationId The ID of the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the teams within the organization.
     */
    public async getTeams(organizationId: string, signal?: AbortSignal): Promise<OrganizationTeam[]>
    {
        const result = await this._apiClient.get(`organizations/${organizationId}/teams`,
        {
            signal
        });

        return result.data.map(team => new OrganizationTeam(team));
    }

    /**
     * Creates the specified team within the specified organization.
     * @param organizationId The ID of the organization.
     * @param team The team to create.
     * @returns A promise that will be resolved with the new team.
     */
    public async createTeam(organizationId: string, team: OrganizationTeam): Promise<OrganizationTeam>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/teams/create`,
        {
            body: team
        });

        return new OrganizationTeam(result.data);
    }

    /**
     * Updates the specified team within the specified organization.
     * @param organizationId The ID of the organization.
     * @param team The team to save.
     * @returns A promise that will be resolved with the new team.
     */
    public async updateTeam(organizationId: string, team: OrganizationTeam): Promise<OrganizationTeam>
    {
        const result = await this._apiClient.post(`organizations/${organizationId}/teams/${team.id}/update`,
        {
            body: team
        });

        return new OrganizationTeam(result.data);
    }

    /**
     * Deletes the specified team within the specified organization.
     * @param organizationId The ID of the organization.
     * @param teamId The ID of the team to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteTeam(organizationId: string, teamId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/delete`);
    }

    /**
     * Gets the users within the specified organization team.
     * @param organizationId The ID of the organization.
     * @param teamId The ID of the team.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the users within the organization team.
     */
    public async getUsersInTeam(organizationId: string, teamId: string, signal?: AbortSignal): Promise<OrganizationUser[]>
    {
        const result = await this._apiClient.get(`organizations/${organizationId}/teams/${teamId}/users`,
        {
            signal
        });

        return result.data.map(user => new OrganizationUser(user));
    }

    /**
     * Adds the specified user to the specified organization team.
     * @param organizationId The ID of the organization.
     * @param teamId The ID of the team.
     * @param userId The ID of the user to add.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async addUserToTeam(organizationId: string, teamId: string, userId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/users/add`,
        {
            body: { userId }
        });
    }

    /**
     * Removes the specified user from the specified organization team.
     * @param organizationId The ID of the organization.
     * @param teamId The ID of the team.
     * @param userId The ID of the user to remove.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async removeUserFromTeam(organizationId: string, teamId: string, userId: string): Promise<void>
    {
        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/users/${userId}/remove`);
    }
}
