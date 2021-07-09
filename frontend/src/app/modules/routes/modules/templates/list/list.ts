import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
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
     * True if initial loading failed
     */
    protected failed: boolean = false;

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
    protected results?: RouteTemplateInfo[];

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        // Create and execute the new operation.
        this.fetchOperation = new Operation(async signal =>
        {
            this.failed = false;

            try
            {
                const result = await this._routeTemplateService.getAll(signal);
                this.results = result;
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.", error);
            }
        });
    }

    /**
     * Called by the framework when the module is deactivated.
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
