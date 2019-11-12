import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { RouteTemplateService, RouteTemplateInfo, RouteTemplate } from "app/model/route-template";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    id?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param routeTemplateService The `RouteTemplateService` instance.
     */
    public constructor(routeTemplateService: RouteTemplateService)
    {
        this._routeTemplateService = routeTemplateService;
    }

    private readonly _routeTemplateService: RouteTemplateService;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The template to present.
     */
    protected template: Partial<RouteTemplateInfo>;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        if (params.id)
        {
            // Create and execute the new operation.
            this.fetchOperation = new Operation(async signal =>
            {
                // Fetch the data.
                this.template = await this._routeTemplateService.get(params.id!, signal);
            });
        }
        else
        {
            this.template = new RouteTemplate();
        }
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }
    }
}
