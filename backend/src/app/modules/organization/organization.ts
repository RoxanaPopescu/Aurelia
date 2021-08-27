import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

// TODO: Add permission checks

/**
 * Represents a module exposing endpoints related to roles within an organization.
 */
export class OrganizationModule extends AppModule
{
    // DONE
    /**
     * Creates a new organization.
     * @param context.body The data for the new organization.
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
            id: result.data.organization.organizationId,
            name: result.data.organization.name,
            type: result.data.organization.organizationType
        };

        context.response.status = 200;
    }

    // DONE
    // TODO:BACKEND: WTF is up with Swagger? the description correctly claims we get both users and invites, but the response example indicates otherwise
    // TODO:BACKEND: WTF is up with this endpoint? path makes no sense, and neither does invitations being included
    // TODO:BACKEND: Return full objects to avoid N+1 problem
    // TODO:BACKEND: Endpoint path should follow REST conventions
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

    // DONE
    // TODO:BACKEND: Endpoint path should end with /profile
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

    // TODO:BACKEND: Endpoint missing
    // TODO:BACKEND: Consider returning full model, if we at some point need lastChanged, etc.
    /**
     * Saves the profile for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.body The profile to save.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/profile/save" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.request.body.name

        context.response.status = 204;
    }

    // TODO:BACKEND: Add missing properties in request model.
    // TODO:BACKEND: Return the full invite model
    // TODO:BACKEND: Endpoint path should follow REST conventions
    /**
     * Sends the specified invite.
     * @param context.params.organizationId The ID of the organization.
     * @param context.body The invite to send.
     * @returns
     * - 200: An object representing the new user.
     */
    public "POST /v2/organizations/:organizationId/invites/send" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.request.body.email
        // context.request.body.roleId
        // context.request.body.teamId
        // context.request.body.message

        // Response:
        // {
        //     id: "invite-id",
        //     email: "johndoe@example.com",
        //     role: { id: "role-id", name: "Role 1" },
        //     team: { id: "team-id", name: "Team 1" }
        // }

        // WIP:

        const result = await this.apiClient.post("identity/memberships/invitation",
        {
            body:
            {
                userEmail: context.request.body.email,
                roleId: context.request.body.roleId,
                teamId: context.request.body.teamId, // TODO: missing
                message: context.request.body.message // TODO // TODO: missing
            }
        });

        context.response.body =
        {
            id: result.data.id, // TODO: could get from request, but doesn't make sense
            email: result.data.username, // TODO: could get from request, but doesn't make sense
            role: result.data.role, // TODO: we only get id, need full object
            team: result.data.team // TODO: we only get id, need full object
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Gets the pending invites within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the pending invites within the organization.
     */
    public "GET /v2/organizations/:organizationId/invites" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId

        // Response:
        // [
        //     {
        //         id: "invite-id",
        //         email: "johndoe@example.com",
        //         role: { id: "role-id", name: "Role 1" },
        //         team: { id: "team-id", name: "Team 1" },
        //     }
        // ]

        context.response.status = 200;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Resends the specified invite.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.inviteId The ID of the invite to resend.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/invites/:inviteId/resend" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.params.inviteId

        context.response.status = 204;
    }

    // DONE
    // TODO:BACKEND: Endpoint path should follow REST conventions
    /**
     * Revokes the specified invite.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.inviteId The ID of the invite to revoke.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/invites/:inviteId/revoke" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.delete(`identity/memberships/invitation/${context.params.inviteId}`);

        context.response.status = 204;
    }

    // TODO:BACKEND: Return full user objects
    // TODO:BACKEND: Endpoint path should follow REST conventions
    /**
     * Gets the users within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the users within the organization.
     */
    public "GET /v2/organizations/:organizationId/users" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId

        // Response:
        // [
        //     {
        //         id: "user-id",
        //         fullName: "John Doe",
        //         preferredName: "John",
        //         email: "johndoe@example.com",
        //         phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        //         pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200",
        //         role: { id: "role-id", name: "Role 1" },
        //         team: { id: "team-id", name: "Team 1" },
        //         lastOnline: undefined
        //     }
        // ]

        // WIP:

        const result = await this.apiClient.get("identity/users",
        {
            query:
            {
                organizationId: context.params.organizationId
            }
        });

        context.response.body = result.data.listOrganizationUsers.map((user: any) =>
        ({
            id: user.id,
            fullName: user.fullName, // TODO: missing
            preferredName: user.preferredName, // TODO: missing
            email: user.userName, // TODO: why not email?
            phoneNumber: user.phoneNumber, // TODO: missing
            pictureUrl: user.pictureUrl, // TODO: missing
            role: user.role, // TODO: missing
            team: user.team, // TODO: missing
            status: user.status, // TODO: missing
            lastOnline: user.lastOnline // TODO: missing
        }));

        context.response.status = 200;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Resends the invite for the specified user to the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.userId The ID of the user whose role should be changed..
     * @param context.body.roleId The ID of the role to assign to the user.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/users/:userId/change-role" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.params.userId
        // context.body.roleId

        context.response.status = 204;
    }

    // DONE
    // TODO:BACKEND: Endpoint path should follow REST conventions
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
            body:
            {
                organizationId: context.params.organizationId,
                userId: context.params.userId
            }
        });

        context.response.status = 204;
    }

    // TODO:BACKEND: Endpoint missing
    // TODO:FRONTEND: Hardcode in BFF as temporary workaround
    /**
     * Gets the permissions available within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the permissions.
     */
    public "GET /v2/organizations/:organizationId/permissions" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId

        // Response:
        // [
        //     { slug: "view-organization", type: "view", group: "Organization", name: "View organization" }
        // ]

        context.response.status = 200;
    }

    // TODO:BACKEND: Return full object.
    /**
     * Creates the specified role within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.body The role to create.
     * @returns
     * - 200: An object representing the new role.
     */
    public "POST /v2/organizations/:organizationId/roles/create" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("organization/roles",
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
            id: result.data.roleId,
            name: context.request.body.name, // TODO: can get this from request, but doesn't make sense
            createdDateTime: result.data.createdAt, // TODO: missing
            modifiedDateTime: result.data.lastChanged, // TODO: missing
            permissions: context.request.body.permissions, // TODO: can get this from request, but doesn't make sense
            userCount: 0
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: How do we get userCount?
    /**
     * Gets the roles within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An array of objects representing the roles within the organization.
     */
    public "GET /v2/organizations/:organizationId/roles" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`organization/organizations/${context.params.organizationId}/roles`);

        context.response.body = result.data.organizationRoles.map((r: any) =>
        ({
            id: r.id,
            name: r.name,
            createdDateTime: r.createdAt,
            modifiedDateTime: r.lastUpdate,
            permissions: r.permissions.map((p: any) => p.name), // TODO: verify name really is the slug
            userCount: undefined // TODO: how do we get this?
        }));

        context.response.status = 200;
    }

    // TODO:BACKEND: Return full object.
    // TODO:BACKEND: Fix spelling of "duplicate" in endpoint path
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

        const result = await this.apiClient.post(`organization/roles/${context.params.roleId}/duplicate`);

        context.response.body =
        {
            id: result.data.roleId,
            name: result.data.roleName,
            createdDateTime: result.data.createdAt, // TODO: missing
            modifiedDateTime: result.data.lastChanged, // TODO: missing
            permissions: result.data.permissions,
            userCount: 0
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: Return full object.
    /**
     * Saves the specified role within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.roleId The ID of the role.
     * @param context.body The role to save.
     * @returns
     * - 200: An object representing the updated role.
     */
    public "POST /v2/organizations/:organizationId/roles/:roleId/save" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.put(`organization/roles/${context.params.roleId}`,
        {
            body:
            {
                name: context.request.body.name,
                permissions: context.request.body.permissions
            }
        });

        context.response.body =
        {
            id: context.params.roleId, // TODO: can get this from request, but doesn't make sense
            name: context.request.body.name, // TODO: can get this from request, but doesn't make sense
            createdDateTime: result.data.createdAt, // TODO: missing
            modifiedDateTime: result.data.lastChanged, // TODO: missing
            permissions: context.request.body.permissions, // TODO: can get this from request, but doesn't make sense
            userCount: NaN // TODO: how do we get this?
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: roleName? WTF?!
    // TODO:BACKEND: Endpoint path should follow REST conventions
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

        await this.apiClient.delete("organization/roles",
        {
            body:
            {
                organizationId: context.params.organizationId
                // TODO: roleName? WTF, should be roleId
            }
        });

        context.response.status = 204;
    }

    /**
     * Creates the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.body The team to create.
     * @returns
     * - 200: An object representing the new team.
     */
    public "POST /v2/organizations/:organizationId/teams/create" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.body.name
        // context.body.phoneNumber
        // context.body.address
        // context.body.vatNumber: string
        // context.body.invoiceDirectly
        // context.body.invoiceEmail

        // Response:
        // {
        //     id: "team-id",
        //     name: "Team 2",
        //     phoneNumber: { countryCallingCode: "45", nationalNumber: "69696969" },
        //     address: { primary: "Bar Street 42", secondary: "1337 Denmark" },
        //     vatNumber: "69042",
        //     invoiceDirectly: true,
        //     invoiceEmail: "team2@example.com",
        //     userCount: 0
        // }

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

        // Request:
        // context.params.organizationId

        // Response Array(5).fill(
        // {
        //     id: "team-id",
        //     name: "Team 1",
        //     phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        //     address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        //     vatNumber: "42069",
        //     invoiceDirectly: true,
        //     invoiceEmail: "team1@example.com",
        //     userCount: 1
        // })

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

        // Request:
        // context.params.organizationId
        // context.params.teamId

        // Response:
        // {
        //     id: "team-id",
        //     name: "Team 1",
        //     phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        //     address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        //     vatNumber: "42069",
        //     invoiceDirectly: true,
        //     invoiceEmail: "team1@example.com",
        //     userCount: 1
        // }

        context.response.status = 200;
    }

    /**
     * Updates the specified team within the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param team The team to save.
     * @returns
     * - 200: An object representing the updated team.
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/save" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId

        // Response:
        // {
        //     id: "team-id",
        //     name: "Team 1 [updated]",
        //     phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        //     address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        //     vatNumber: "42069",
        //     invoiceDirectly: true,
        //     invoiceEmail: "team1@example.com",
        //     userCount: 1
        // }

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

        // Request:
        // context.params.organizationId
        // context.params.teamId

        context.response.status = 204;
    }

    /**
     * Adds the specified user to the specified organization team.
     * @param context.params.organizationId The ID of the organization.
     * @param context.params.teamId The ID of the team.
     * @param context.body.userId The ID of the user to assign to the team.
     * @returns
     * - 204: No content
     */
    public "POST /v2/organizations/:organizationId/teams/:teamId/users/add" = async (context: AppContext) =>
    {
        await context.authorize();

        // Request:
        // context.params.organizationId
        // context.params.teamId
        // context.body.userId

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

        // Request:
        // context.params.organizationId
        // context.params.teamId

        // Response:
        // [
        //     {
        //         id: "user-id",
        //         fullName: "John Doe",
        //         preferredName: "John",
        //         email: "johndoe@example.com",
        //         phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        //         pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200",
        //         role: { id: "role-id", name: "Role 1" },
        //         team: { id: "team-id", name: "Team 1" },
        //         lastOnline: DateTime.utc().toISO()
        //     }
        // ]

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

        // Request:
        // context.params.organizationId
        // context.params.teamId
        // context.params.userId

        context.response.status = 204;
    }
}
