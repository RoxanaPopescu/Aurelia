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
    public async getAll(signal?: AbortSignal): Promise<{ templates: RouteTemplateInfo[]; templateCount: number }>
    {
        const result = await this._apiClient.post("route-templates/list",
        {
            body:
            {
            },
            signal
        });

        return {
            templates: result.data.templates.map((data: any) => new RouteTemplateInfo(data)),
            templateCount: result.data.templateCount
        };
    }

    /**
     * Gets the specified route template.
     * @param id The ID identifying the route template.
     * @returns A promise that will be resolved with the route template.
     */
    public async get(routeSlug: string): Promise<RouteTemplate>
    {
        const result = await this._apiClient.get("route-templates/details",
        {
            query: { routeSlug }
        });

        return new RouteTemplate(result.data);
    }
}
