import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IScroll } from "shared/framework";
import { RouteTemplateService, RouteTemplateInfo } from "app/model/route-template";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
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
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected templateCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected templates: RouteTemplateInfo[];

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        // Create and execute the new operation.
        this.fetchOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._routeTemplateService.getAll(signal);

            // Update the state.
            this.templates = result.templates;
        });
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
