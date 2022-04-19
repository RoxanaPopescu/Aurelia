import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { RouteTemplateService, RouteTemplateInfo } from "app/model/route-template";
import { ConfirmDeleteTemplateDialog } from "./modals/confirm-delete-template/confirm-delete-template";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(routeTemplateService: RouteTemplateService, modalService: ModalService)
    {
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;

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

    /**
     * Called when the "Delete template" icon is clicked.
     * Deletes the template.
     * @param template The template to delete.
     */
    protected async onDeleteClick(template: RouteTemplateInfo): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteTemplateDialog).promise)
        {
            return;
        }

        try
        {
            await this._routeTemplateService.delete(template.id);

            this.results?.splice(this.results.indexOf(template), 1);
        }
        catch (error)
        {
            Log.error("Could not delete template", error);
        }
    }
}
