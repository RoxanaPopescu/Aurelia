import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RouteTemplateInfo } from "../entities/route-template-info";
import { RouteTemplate } from "../entities/route-template";

/**
 * Represents a service that manages route templates.
 */
@autoinject
export class RouteTemplateService
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
     * Gets all route templates visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route templates.
     */
    public async getAll(signal?: AbortSignal): Promise<RouteTemplateInfo[]>
    {
        const result = await this._apiClient.post("routes/templates/list",
        {
            signal
        });

        return result.data.results.map((data: any) => new RouteTemplateInfo(data));
    }

    /**
     * Gets the specified route template.
     * @param slug The slug identifying the route template.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route template.
     */
    public async get(slug: string, signal?: AbortSignal): Promise<RouteTemplate>
    {
        const result = await this._apiClient.post("routes/templates/details",
        {
            body: { slug },
            signal
        });

        return new RouteTemplate(result.data);
    }

    /**
     * Creates the specified route template.
     * @param routeTemplate The route template to create.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async create(routeTemplate: Partial<RouteTemplate>): Promise<void>
    {
        const result = await this._apiClient.post("routes/templates/create",
        {
            body: routeTemplate
        });

        routeTemplate.id = result.data.id;
        routeTemplate.slug = result.data.slug;
    }

    /**
     * Saves the specified route template.
     * @param routeTemplate The route template to save.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async update(routeTemplate: RouteTemplate): Promise<void>
    {
        const result = await this._apiClient.post("routes/templates/update",
        {
            body: routeTemplate
        });

        routeTemplate.slug = result.data.slug;
    }

    /**
     * Deletes the specified route template.
     * @param id The ID identifying the route template.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post("routes/templates/delete",
        {
            body: { id }
        });
    }
}
