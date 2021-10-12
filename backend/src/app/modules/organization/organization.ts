import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

// TODO: Add permission checks

/**
 * Represents a module exposing endpoints related to roles within an organization.
 */
export class OrganizationModule extends AppModule
{
    /**
     * Creates a new organization.
     * @param context.request.body The data for the new organization.
     * @returns
     * - 200: An object representing info about the organization.
     */
    public "POST /v2/organizations/create" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("organization/organizations/create",
        {
            body:
            {
                organizationType: context.request.body.type,
                name: context.request.body.name,
                initialOwnerUserId: context.user!.id
            }
        });

        context.response.body =
        {
            id: result.data.organizationId,
            name: context.request.body.name,
            type: context.request.body.type
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: Return full objects to avoid N+1 problem
    /**
     * Gets all organizations visible to the current user.
     * @returns
     * - 200: An array of objects representing info about the organizations.
     */
    public "GET /v2/organizations" = async (context: AppContext) =>
    {
        await context.authorize();

        const result1 = await this.apiClient.get(`identity/memberships/users/${context.user!.id}`);

        const organizations = await Promise.all(result1.data.organizationMemberships.map(async (membership: any) =>
        {
            const result2 = await this.apiClient.get(`organization/organizations/${membership.organizationId}`);

            const organization =
            {
                id: result2.data.organization.organizationId,
                name: result2.data.organization.name,
                type: result2.data.organization.organizationType
            };

            return organization;
        }));

        context.response.body = organizations;
        context.response.status = 200;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Deletes the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`organization/organizations/${context.params.organizationId}`);

        context.response.status = 204;
    }

    /**
     * Gets the profile for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An object representing the profile for the organization.
     */
    public "GET /v2/organizations/:organizationId/profile" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`organization/organizations/${context.params.organizationId}`);

        context.response.body =
        {
            id: result.data.organization.organizationId,
            name: result.data.organization.name,
            type: result.data.organization.organizationType
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: Consider returning the model, if we at some point need lastChange, etc.
    /**
     * Saves the profile for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The profile to save.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/profile/save" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("organization/organizations/update",
        {
            body:
            {
                organizationId: context.params.organizationId,
                name: context.request.body.name
            }
        });

        context.response.status = 204;
    }

    // TODO:BACKEND: Properties missing in request model (team)
    /**
     * Sends the specified user invite.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The invite to send.
     * @param context.request.body.acceptUrl The URL for the "Accept invite" page.
     * @returns
     * - 200: An object representing the new user.
     */
    public "POST /v2/organizations/:organizationId/invites/send" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("identity/memberships/invitations",
        {
            body:
            {
                userEmail: context.request.body.email,
                roleId: context.request.body.roleId,
                teamIds: context.request.body.teamIds,
                message: context.request.body.message,
                acceptUrl: context.request.body.acceptUrl
            }
        });

        context.response.body =
        {
            id: result.data.id,
            email: result.data.email,
            role: result.data.role,
            teams: result.data.teams
        };

        context.response.status = 200;
    }

    /**
     * Gets the pending invites within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the pending invites within the organization.
     */
    public "GET /v2/organizations/:organizationId/invites" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("identity/memberships/invitations",
        {
            query:
            {
                organizationId: context.params.organizationId
            }
        });

        context.response.body = result.data.invitations.map((invite: any) =>
        ({
            id: invite.id,
            email: invite.invitedEmailAddress,
            role: invite.role,
            teams: invite.teams
        }));

        context.response.status = 200;
    }

    /**
     * Gets the specified user invite.
     * @param context.params.inviteId The ID of the invite.
     * @returns
     * - 200: An object representing the specified user invite.
     */
    public "GET /v2/invites/:inviteId" = async (context: AppContext) =>
    {
        await context.authorize();

        const result1 = await this.apiClient.get(`identity/memberships/invitations/${context.params.inviteId}`);

        if (result1.data.invitedEmailAddress.toLowerCase() !== context.user?.email.toLowerCase())
        {
            context.response.status = 403;

            return;
        }

        const result2 = await this.apiClient.get(`organization/organizations/${result1.data.organizationId}`);

        context.response.body =
        {
            id: result1.data.id,
            email: result1.data.invitedEmailAddress,
            organization:
            {
                id: result2.data.organization.organizationId,
                name: result2.data.organization.name,
                type: result2.data.organization.organizationType
            },
            role: result1.data.role,
            teams: result1.data.teams
        };

        context.response.status = 200;
    }

    /**
     * Resends the specified user invite.
     * @param context.params.inviteId The ID of the invite to resend.
     * @returns
     * - 204: No content
     */
    public "POST /v2/invites/:inviteId/resend" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post(`identity/memberships/invitations/${context.params.inviteId}/resend`);

        context.response.status = 204;
    }

    /**
     * Accepts the specified user invite.
     * @param context.params.inviteId The ID of the invite to accept.
     * @returns
     * - 204: No content
     */
    public "POST /v2/invites/:inviteId/accept" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post(`identity/memberships/invitations/${context.params.inviteId}/accept`);

        context.response.status = 204;
    }

    /**
     * Deletes the specified user invite.
     * @param context.params.inviteId The ID of the invite to revoke.
     * @returns
     * - 204: No content
     */
    public "POST /v2/invites/:inviteId/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`identity/memberships/invitations/${context.params.inviteId}`);

        context.response.status = 204;
    }

    /**
     * Gets the users within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the users within the organization.
     */
    public "GET /v2/organizations/:organizationId/users" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("identity/users",
        {
            query:
            {
                organizationId: context.params.organizationId
            }
        });

        context.response.body = result.data.users;

        context.response.status = 200;
    }

    /**
     * Resends the invite for the specified user to the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.userId The ID of the user whose role should be changed..
     * @param context.request.body.roleId The ID of the role to assign to the user.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/users/:userId/change-role" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.put("identity/memberships",
        {
            query:
            {
                organizationId: context.params.organizationId,
                userId: context.params.userId
            },
            body:
            {
                newRoleId: context.request.body.roleId
            }
        });

        context.response.status = 204;
    }

    /**
     * Removes the specified user from the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.userId The ID of the user to remove.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/users/:userId/remove" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete("identity/memberships",
        {
            query:
            {
                organizationId: context.params.organizationId,
                userId: context.params.userId
            }
        });

        context.response.status = 204;
    }

    /**
     * Gets the permissions available within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the permissions.
     */
    public "GET /v2/organizations/:organizationId/permissions" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/permissions`);

        context.response.body = result.data.permissions.map((permission: any) =>
        ({
            slug: permission.slug,
            type: permission.type.toLowerCase(),
            group: permission.group,
            name: permission.name ?? permission.slug
        }));

        context.response.status = 200;
    }

    /**
     * Creates the specified role within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The role to create.
     * @returns
     * - 200: An object representing the new role.
     */
    public "POST /v2/organizations/:organizationId/roles/create" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("identity/roles",
        {
            body:
            {
                organizationId: context.params.organizationId,
                roleName: context.request.body.name,
                permissions: context.request.body.permissions
            }
        });

        context.response.body =
        {
            id: result.data.id,
            name: result.data.name,
            readonly: result.data.readonly,
            createdDateTime: result.data.createdAt,
            modifiedDateTime: result.data.lastUpdate,
            permissions: result.data.permissions,
            userCount: result.data.userCount
        };

        context.response.status = 200;
    }

    /**
     * Gets the roles within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the roles within the organization.
     */
    public "GET /v2/organizations/:organizationId/roles" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/roles`);

        context.response.body = result.data.organizationRoles.map((r: any) =>
        ({
            id: r.id,
            name: r.name,
            createdDateTime: r.createdAt,
            modifiedDateTime: r.lastUpdate,
            permissions: r.permissions,
            readonly: r.readOnly,
            userCount: r.userCount
        }));

        context.response.status = 200;
    }

    /**
     * Creates a new role as a duplicate of the specified role.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.roleId The ID of the role to duplicate.
     * @returns
     * - 200: An object representing the new role.
     */
    public "POST /v2/organizations/:organizationId/roles/:roleId/duplicate" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post(`identity/roles/${context.params.roleId}/duplicate`);

        context.response.body =
        {
            id: result.data.id,
            name: result.data.name,
            readonly: result.data.readonly,
            createdDateTime: result.data.createdAt,
            modifiedDateTime: result.data.lastUpdate,
            permissions: result.data.permissions,
            userCount: result.data.userCount
        };

        context.response.status = 200;
    }

    /**
     * Saves the specified role within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.roleId The ID of the role.
     * @param context.request.body The role to save.
     * @returns
     * - 200: An object representing the updated role.
     */
    public "POST /v2/organizations/:organizationId/roles/:roleId/save" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.put(`identity/roles/${context.params.roleId}`,
        {
            body:
            {
                name: context.request.body.name,
                permissions: context.request.body.permissions
            }
        });

        context.response.body =
        {
            id: result.data.id,
            name: result.data.name,
            readonly: result.data.readonly,
            createdDateTime: result.data.createdAt,
            modifiedDateTime: result.data.lastUpdate,
            permissions: result.data.permissions,
            userCount: result.data.userCount
        };

        context.response.status = 200;
    }

    /**
     * Deletes the specified role within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.roleId The ID of the role to delete.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/roles/:roleId/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`identity/roles/${context.params.roleId}`);

        context.response.status = 204;
    }

    /**
     * Creates the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The team to create.
     * @returns
     * - 200: An object representing the new team.
     */
    public "POST /v2/organizations/:organizationId/teams/create" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post(`identity/organizations/${context.params.organizationId}/teams`,
        {
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the teams within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the teams within the organization.
     */
    public "GET /v2/organizations/:organizationId/teams" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams`);

        context.response.body = result.data.teams;
        context.response.status = 200;
    }

    /**
     * Gets the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @returns
     * - 200: An object representing the specified team.
     */
    public "GET /v2/organizations/:organizationId/teams/:teamId" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}`);

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Updates the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The team to save.
     * @returns
     * - 200: An object representing the updated team.
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/save" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.put(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}`,
        {
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Deletes the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team to delete.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}`);

        context.response.status = 204;
    }

    /**
     * Adds the specified user to the specified organization team.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @param context.request.body.userId The ID of the user to assign to the team.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/users/add" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}/users`,
        {
            body: context.request.body
        });

        context.response.status = 204;
    }

    /**
     * Gets the users within the specified organization team.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @returns
     * - 200: An array of objects representing the users within the organization team.
     */
    public "GET /v2/organizations/:organizationId/teams/:teamId/users" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}/users`);

        context.response.body = result.data.users;
        context.response.status = 200;
    }

    /**
     * Removes the specified user from the specified organization team.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @param context.params.userId The ID of the user to remove from the team.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/users/:userId/remove" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}/users/${context.params.userId}`);

        context.response.status = 204;
    }
}
