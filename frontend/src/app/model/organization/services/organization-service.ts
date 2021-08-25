import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
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
     * @param identityService The `IdentityService` instance.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(identityService: IdentityService, apiClient: ApiClient)
    {
        this._apiClient = apiClient;
        this._identityService = identityService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _identityService: IdentityService;

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
     * Deletes the current organization.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/delete`);
    }

    /**
     * Gets the profile for the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the profile for the organization.
     */
    public async getProfile(signal?: AbortSignal): Promise<OrganizationProfile>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/profile`,
        {
            signal
        });

        return new OrganizationProfile(result.data);
    }

    /**
     * Updates the profile for the current organization.
     * @param profile The profile to save.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveProfile(profile: OrganizationProfile): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/profile/update`,
        {
            body: profile
        });
    }

    /**
     * Gets the users within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the users within the organization.
     */
    public async getUsers(signal?: AbortSignal): Promise<OrganizationUser[]>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/users`,
        {
            signal
        });

        return result.data.map(user => new OrganizationUser(user));
    }

    /**
     * Invites the specified user to the current organization.
     * @param invite The invite to send.
     * @returns A promise that will be resolved with the new user.
     */
    public async inviteUser(invite: IOrganizationUserInvite): Promise<OrganizationUser>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/users/invite`,
        {
            body: invite
        });

        return new OrganizationUser(result.data);
    }

    /**
     * Resends the invite for the specified user to the current organization.
     * @param userId The ID of the user to invite.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async reinviteUser(userId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/users/${userId}/reinvite`);
    }

    /**
     * Changes the role of the specified user in the current organization.
     * @param userId The ID of the user to invite.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async changeUserRole(userId: string, roleId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/users/${userId}/changeRole`,
        {
            body: { roleId }
        });
    }

    /**
     * Removes the specified user from the current organization.
     * @param userId The ID of the user to remove.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async removeUser(userId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/users/${userId}/remove`);
    }

    /**
     * Gets the permissions available within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the permissions.
     */
     public async getPermissions(signal?: AbortSignal): Promise<OrganizationPermission[]>
     {
         const organizationId = this._identityService.identity!.outfit!.id;

         const result = await this._apiClient.get(`organizations/${organizationId}/permissions`,
         {
             signal
         });

         return result.data.map(permission => new OrganizationPermission(permission));
     }

    /**
     * Gets the roles within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the roles within the organization.
     */
    public async getRoles(signal?: AbortSignal): Promise<OrganizationRole[]>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/roles`,
        {
            signal
        });

        return result.data.map(role => new OrganizationRole(role));
    }

    /**
     * Creates the specified role within the current organization.
     * @param role The role to create.
     * @returns A promise that will be resolved with the new role.
     */
    public async createRole(role: OrganizationRole): Promise<OrganizationRole>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/roles/create`,
        {
            body: role
        });

        return new OrganizationRole(result.data);
    }

    /**
     * Updates the specified role within the current organization.
     * @param role The role to save.
     * @returns A promise that will be resolved with the new role.
     */
    public async saveRole(role: OrganizationRole): Promise<OrganizationRole>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/roles/${role.id}/update`,
        {
            body: role
        });

        return new OrganizationRole(result.data);
    }

    /**
     * Deletes the specified role within the current organization.
     * @param roleId The ID of the role to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteRole(roleId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/roles/${roleId}/delete`);
    }

    /**
     * Creates a new role as a dublicate of the specified role.
     * @param roleId The ID of the role to dublicate.
     * @returns A promise that will be resolved with the new role.
     */
    public async duplicateRole(roleId: string): Promise<OrganizationRole>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/roles/${roleId}/dublicate`);

        return new OrganizationRole(result.data);
    }

    /**
     * Gets the teams within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the teams within the organization.
     */
    public async getTeams(signal?: AbortSignal): Promise<OrganizationTeam[]>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/teams`,
        {
            signal
        });

        return result.data.map(team => new OrganizationTeam(team));
    }

    /**
     * Gets the specified team within the current organization.
     * @param teamId The ID of the team.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the specified team.
     */
    public async getTeam(teamId: string, signal?: AbortSignal): Promise<OrganizationTeam>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/teams/${teamId}`,
        {
            signal
        });

        return new OrganizationTeam(result.data);
    }

    /**
     * Creates the specified team within the current organization.
     * @param team The team to create.
     * @returns A promise that will be resolved with the new team.
     */
    public async createTeam(team: OrganizationTeam): Promise<OrganizationTeam>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/teams/create`,
        {
            body: team
        });

        return new OrganizationTeam(result.data);
    }

    /**
     * Updates the specified team within the current organization.
     * @param team The team to save.
     * @returns A promise that will be resolved with the new team.
     */
    public async saveTeam(team: OrganizationTeam): Promise<OrganizationTeam>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.post(`organizations/${organizationId}/teams/${team.id}/update`,
        {
            body: team
        });

        return new OrganizationTeam(result.data);
    }

    /**
     * Deletes the specified team within the current organization.
     * @param teamId The ID of the team to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteTeam(teamId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/delete`);
    }

    /**
     * Gets the users within the current organization team.
     * @param teamId The ID of the team.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the users within the organization team.
     */
    public async getUsersInTeam(teamId: string, signal?: AbortSignal): Promise<OrganizationUser[]>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        const result = await this._apiClient.get(`organizations/${organizationId}/teams/${teamId}/users`,
        {
            signal
        });

        return result.data.map(user => new OrganizationUser(user));
    }

    /**
     * Adds the specified user to the current organization team.
     * @param teamId The ID of the team.
     * @param userId The ID of the user to assign to the team.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async addUserToTeam(teamId: string, userId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/users/add`,
        {
            body: { userId }
        });
    }

    /**
     * Removes the specified user from the current organization team.
     * @param teamId The ID of the team.
     * @param userId The ID of the user to remove from the team.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async removeUserFromTeam(teamId: string, userId: string): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        await this._apiClient.post(`organizations/${organizationId}/teams/${teamId}/users/${userId}/remove`);
    }
}
