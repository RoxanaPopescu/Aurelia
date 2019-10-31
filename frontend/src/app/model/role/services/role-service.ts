import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Role } from "../entities/role";
import { ClaimGroup } from "../entities/claim-group";
import { RoleInfo } from "../entities/role-info";

/**
 * Represents a service that manages role roles.
 */
@autoinject
export class RoleService
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
     * Gets all available roles.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with info about the roles.
     */
    public async getAll(signal?: AbortSignal): Promise<RoleInfo[]>
    {
        const result = await this._apiClient.get("roles/list",
        {
            signal
        });

        return result.data.map(data => new RoleInfo(
        {
            name: data.roleName,
            id: data.roleId
        }));
    }

    /**
     * Gets the specified role.
     * @param roleId The ID of the role to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the role.
     */
    public async get(roleId: string, signal?: AbortSignal): Promise<Role>
    {
        const result = await this._apiClient.post("roles/details",
        {
            body: { roleId },
            signal
        });

        return new Role(
        {
            name: result.data.role.roleName,
            id: result.data.role.roleId,
            claimGroups: this.getDistinctClaimGroups(result.data.groups)
        });
    }

    /**
     * Creates the specified role.
     * @param role The role to create.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(role: Role): Promise<void>
    {
        await this._apiClient.post("roles/create",
        {
            body:
            {
                roleName: role.name,
                groupIds: role.claimGroups ? role.claimGroups.map(g => g.id) : undefined
            }
        });
    }

    /**
     * Updates the specified role.
     * @param role The role to update.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async update(role: Role): Promise<void>
    {
        await this._apiClient.post("roles/update",
        {
            body:
            {
                roleId: role.id,
                roleName: role.name,
                groupIds: role.claimGroups ? role.claimGroups.map(g => g.id) : undefined
            }
        });
    }

    /**
     * Gets all available claim groups.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the claim groups.
     */
    public async getClaimGroups(signal?: AbortSignal): Promise<ClaimGroup[]>
    {
        const result = await this._apiClient.get("groups/list",
        {
            signal
        });

        return this.getDistinctClaimGroups(result.data).map(data => new ClaimGroup(data));
    }

    /**
     * HACK: This really should not be needed.
     * Filters the specified claim groups to only include distinct entities.
     * @param claimGroups The data representing the claim groups to filter.
     * @returns The data representing the distinct claim groups.
     */
    private getDistinctClaimGroups(claimGroups: any[]): any[]
    {
        const claimGroupIds = new Set<string>();

        return claimGroups.filter(g =>
        {
            const exists = claimGroupIds.has(g.groupId);
            claimGroupIds.add(g.groupId);

            return !exists;
        });
    }
}
