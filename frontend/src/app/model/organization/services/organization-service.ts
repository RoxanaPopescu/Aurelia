import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { OrganizationInfo } from "../entities/organization-info";
import { IOrganizationInit } from "../entities/organization-init";

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
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(organizationInit: IOrganizationInit): Promise<void>
    {
        await this._apiClient.post("organizations/create",
        {
            body: organizationInit
        });
    }

    /**
     * Gets all organizations visible to the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the organizations.
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
     * @param id The ID of the organization.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post("organizations/delete",
        {
            body: { id }
        });
    }
}
