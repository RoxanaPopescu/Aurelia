import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RouteTemplateInfo } from "../entities/route-template-info";
import { RouteTemplate } from "../entities/route-template";
import { RouteTemplateStop } from "../entities/route-template-stop";
import { RouteTemplateSchedule } from "../entities/route-template-schedule";
import { CreateRoute } from "../entities/create-route";

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
    public async createRoute(route: CreateRoute): Promise<void>
    {
        await this._apiClient.post("routes/create-from-template",
        {
            body: route.toJSON()
        });
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

    /**
     * Creates the specified route template.
     * @param routeTemplate The route template to create.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async addStop(template: RouteTemplate, stop: RouteTemplateStop): Promise<void>
    {
        const json = stop.toJSON();
        json.templateId = template.id;
        json.atIndex = stop.stopNumber - 1;

        const result = await this._apiClient.post("routes/templates/stops/add",
        {
            body: json
        });

        stop.id = result.data.id;
    }

    /**
     * Creates the specified route template.
     * @param routeTemplate The route template to create.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async updateStop(template: RouteTemplate, stop: RouteTemplateStop): Promise<void>
    {
        const json = stop.toJSON();
        json.templateId = template.id;

        await this._apiClient.post("routes/templates/stops/update",
        {
            body: json
        });
    }

    /**
     * Deletes the specified route stop.
     * @param id The ID identifying the route template.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteStop(id: string): Promise<void>
    {
        await this._apiClient.post("routes/templates/stops/delete",
        {
            body: { id }
        });
    }

    /**
     * Adds a schedule to the tmeplate
     * @param routeTemplate The route template to create.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async addSchedule(template: RouteTemplate, schedule: RouteTemplateSchedule): Promise<void>
    {
        const json = schedule.toJSON();
        json.templateId = template.id;

        const result = await this._apiClient.post("routes/templates/schedules/add",
        {
            body: json
        });

        schedule.id = result.data.id;
    }

    /**
     * Creates the specified route template.
     * @param routeTemplate The route template to create.
     * @returns A promise that will be resolved when teh operation succeedes.
     */
    public async updateSchedule(template: RouteTemplate, schedule: RouteTemplateSchedule): Promise<void>
    {
        const json = schedule.toJSON();
        json.templateId = template.id;

        await this._apiClient.post("routes/templates/schedules/update",
        {
            body: json
        });
    }

    /**
     * Deletes the specified route stop.
     * @param id The ID identifying the route template.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async deleteSchedule(id: string): Promise<void>
    {
        await this._apiClient.post("routes/templates/schedules/delete",
        {
            body: { id }
        });
    }

    /**
     * Moves the specified route stop to the specified index.
     * @param route The route owning the stop.
     * @param stop The route stop to move.
     * @param newIndex The index to which the stop should be moved.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async moveStop(template: RouteTemplate, stop: RouteTemplateStop, newIndex: number): Promise<void>
    {
        const sourceIndex = template.stops.indexOf(stop);

        template.stops.splice(newIndex, 0, ...template.stops.splice(sourceIndex, 1));

        for (let i = 0; i < template.stops.length; i++)
        {
            template.stops[i].stopNumber = i + 1;
        }

        await this._apiClient.post("routes/templates/stops/move",
        {
            body: { templateId: template.id, stopId: stop.id, newIndex }
        });
    }
}
