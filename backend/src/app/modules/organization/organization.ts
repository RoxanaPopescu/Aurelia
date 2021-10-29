import { getStrings } from "../../../shared/localization";
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

            return result2.data.organization;
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
        await context.authorize("delete-organizations", { organization: context.params.organizationId });

        await this.apiClient.delete(`organization/organizations/${context.params.organizationId}`);

        context.response.status = 204;
    }

    /**
     * Gets info about the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An object representing info about the specified organization.
     */
    public "GET /v2/organizations/:organizationId" = async (context: AppContext) =>
    {
        const result = await this.apiClient.get(`organization/organizations/${context.params.organizationId}`);

        context.response.body = result.data.organization;

        context.response.status = 200;
    }

    /**
     * Gets the profile for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An object representing the profile for the specified organization.
     */
    public "GET /v2/organizations/:organizationId/profile" = async (context: AppContext) =>
    {
        await context.authorize("view-organizations", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`organization/organizations/${context.params.organizationId}`);

        context.response.body = result.data.organization;

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
        await context.authorize("edit-organizations", { organization: context.params.organizationId });

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
        await context.authorize("edit-users", { organization: context.params.organizationId });

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
        await context.authorize("edit-users", { organization: context.params.organizationId });

        const result = await this.apiClient.get("identity/memberships/invitations",
        {
            query:
            {
                organizationId: context.params.organizationId
            }
        });

        context.response.body = result.data.invitations;
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
        await context.authorize(); // Note: The backend verifies that the invite is associated with the user.

        const result1 = await this.apiClient.get(`identity/memberships/invitations/${context.params.inviteId}`);

        if (result1.data.email.toLowerCase() !== context.user?.email.toLowerCase())
        {
            context.response.status = 403;

            return;
        }

        const result2 = await this.apiClient.get(`organization/organizations/${result1.data.organizationId}`);

        context.response.body =
        {
            id: result1.data.id,
            email: result1.data.email,
            organization: result2.data.organization,
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
        await context.authorize("edit-users", { organization: context.params.organizationId });

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
        await context.authorize(); // Note: The backend verifies that the invite is associated with the user.

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
        await context.authorize("edit-users", { organization: context.params.organizationId });

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
        await context.authorize("view-users", { organization: context.params.organizationId });

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
        await context.authorize("edit-users", { organization: context.params.organizationId });

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
        await context.authorize("edit-users", { organization: context.params.organizationId });

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
        await context.authorize("edit-roles", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/permissions`);

        const permissionGroupNames = getStrings("./resources/strings/permission-group-names.json");
        const permissionNames = getStrings("./resources/strings/permission-names.json");

        context.response.body = result.data.permissions.map((permission: any) =>
        ({
            slug: permission.slug,
            type: permission.type.toLowerCase(),
            group: permissionGroupNames[permission.group] ?? permission.group,
            name: permissionNames[permission.slug] ?? permission.slug
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
        await context.authorize("create-roles", { organization: context.params.organizationId });

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
        await context.authorize("view-roles", { organization: context.params.organizationId });

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
        await context.authorize("create-roles", { organization: context.params.organizationId });

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
        await context.authorize("edit-roles", { organization: context.params.organizationId });

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
        await context.authorize("delete-roles", { organization: context.params.organizationId });

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
        await context.authorize("create-teams", { organization: context.params.organizationId });

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
     * - 200: An array of objects representing the teams within the specified organization.
     */
    public "GET /v2/organizations/:organizationId/teams" = async (context: AppContext) =>
    {
        await context.authorize("view-teams",
        {
            organization: context.params.organizationId
        });

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams`);

        context.response.body = result.data.teams;
        context.response.status = 200;
    }

    /**
     * Gets the teams accessible to the specified user, within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.userId The ID of the user.
     * @returns
     * - 200: An array of objects representing the teams associated with the specified user, within the specified organization.
     */
    public "GET /v2/organizations/:organizationId/users/:userId/accessible-teams" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams`);

        const accessibleTeams = context.user?.permissions.has("access-all-teams")
            ? result.data.teams
            : result.data.teams.filter((t: any) => context.user?.teamIds.includes(t.id));

        context.response.body = accessibleTeams;
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
        await context.authorize("view-teams", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}`);

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Updates the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @param context.request.body The team to save.
     * @returns
     * - 200: An object representing the updated team.
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/save" = async (context: AppContext) =>
    {
        await context.authorize("edit-teams", { organization: context.params.organizationId });

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
        await context.authorize("delete-teams", { organization: context.params.organizationId });

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
        await context.authorize("edit-teams", { organization: context.params.organizationId });

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
        await context.authorize("view-teams", { organization: context.params.organizationId });

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
        await context.authorize("edit-teams", { organization: context.params.organizationId });

        await this.apiClient.delete(`identity/organizations/${context.params.organizationId}/teams/${context.params.teamId}/users/${context.params.userId}`);

        context.response.status = 204;
    }

    /**
     * Creates the specified connection.
     * @param context.params.organizationId The ID of the current organization.
     * @param context.request.body.organizationId The ID of the organization to invite.
     * @param context.request.body.acceptUrl The URL for the page on which the connection can be accepted.
     * @param context.request.body The connection to create.
     * @returns
     * - 200: An object representing the new connection.
     */
    public "POST /v2/organizations/:organizationId/connections/create" = async (context: AppContext) =>
    {
        await context.authorize("create-connections", { organization: context.params.organizationId });

        const [result1, result2] = await Promise.all(
        [
            this.apiClient.get(`organization/organizations/${context.params.organizationId}`),
            this.apiClient.get(`organization/organizations/${context.request.body.organizationId}`)
        ]);

        const result = await this.apiClient.post(`identity/organizations/${context.params.organizationId}/connections`,
        {
            body:
            {
                fromUserId: context.user!.id,
                fromOrganization:
                {
                    id: context.params.organizationId,
                    name: result1.data.organization.name
                },
                toOrganization:
                {
                    id: context.request.body.organizationId,
                    name: result2.data.organization.name
                },
                acceptUrl: context.request.body.acceptUrl
            }
        });

        context.response.body = await this.mapConnectionModel(context, result.data);

        context.response.status = 200;
    }

    /**
     * Gets the connections associated with the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the connections within the organization.
     */
    public "GET /v2/organizations/:organizationId/connections" = async (context: AppContext) =>
    {
        await context.authorize("view-connections", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/connections`);

        context.response.body = await Promise.all(result.data.map((data: any) => this.mapConnectionModel(context, data)));
        context.response.status = 200;
    }

    /**
     * Gets the specified connection.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.connectionId The ID of the connection to get.
     * @returns
     * - 200: An object representing the connection.
     */
    public "GET /v2/organizations/:organizationId/connections/:connectionId" = async (context: AppContext) =>
    {
        await context.authorize("view-connections", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`identity/organizations/${context.params.organizationId}/connections/${context.params.connectionId}`);

        context.response.body = await this.mapConnectionModel(context, result.data);
        context.response.status = 200;
    }

    /**
     * Accepts the specified connection.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.connectionId The ID of the connection to accept.
     * @returns
     * - 200: An object representing the accepted connection.
     */
    public "POST /v2/organizations/:organizationId/connections/:connectionId/accept" = async (context: AppContext) =>
    {
        await context.authorize("accept-connection", { organization: context.params.organizationId });

        const result = await this.apiClient.post(`identity/organizations/${context.params.organizationId}/connections/${context.params.connectionId}/accept`);

        context.response.body = await this.mapConnectionModel(context, result.data);
        context.response.status = 200;
    }

    /**
     * Deletes the specified connection.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.connectionId The ID of the connection to delete.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/connections/:connectionId/delete" = async (context: AppContext) =>
    {
        await context.authorize("delete-connection", { organization: context.params.organizationId });

        await this.apiClient.delete(`identity/organizations/${context.params.organizationId}/connections/${context.params.connectionId}`);

        context.response.status = 204;
    }

    /**
     * Maps the connection model to what the frontend expects.
     * @param context The request context.
     * @param data The data representing the connection in the backend.
     * @returns The data representing the connection in the frontend.
     */
    private async mapConnectionModel(context: AppContext, data: any): Promise<any>
    {
        const [result1, result2] = await Promise.all(
        [
            this.apiClient.get(`organization/organizations/${data.fromOrganizationId}`),
            this.apiClient.get(`organization/organizations/${data.toOrganizationId}`)
        ]);

        const sent = data.fromOrganizationId === context.user!.organizationId;

        const result =
        {
            id: data.id,
            organization: sent
                ? { id: data.toOrganizationId, name: result2.data.organization.name }
                : { id: data.fromOrganizationId, name: result1.data.organization.name },
            status: data.acceptedAt != null ? "active" : sent ? "invite-sent" : "invite-received",
            createdDateTime: data.createdAt,
            acceptedDateTime: data.acceptedAt
        };

        return result;
    }
}
