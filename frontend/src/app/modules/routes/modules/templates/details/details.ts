import { autoinject, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { RouteTemplateService, RouteTemplate } from "app/model/route-template";
import { Log } from "shared/infrastructure";
import { ModalService, IValidation, ChangeDetector } from "shared/framework";
import { CreateRoutePanel } from "./modals/create-route/create-route";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route template.
     */
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
     * @param modalService The `ModalService` instance.
     */
    public constructor(routeTemplateService: RouteTemplateService, modalService: ModalService)
    {
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;
    private _changeDetector: ChangeDetector;

    /**
     * Current tab page the user is routed to.
     */
    @observable
    protected tab: "general" | "stops" | "schedules" = "general";

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * If the template is being created / updated.
     */
    protected saving: boolean = false;

    /**
     * The template to present.
     */
    protected template: RouteTemplate;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

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
                try
                {
                    this.template = await this._routeTemplateService.get(params.id!, signal);

                    addToRecentEntities(this.template.toEntityInfo());
                }
                catch (error)
                {
                    Log.error("An error occurred while loading the details.", error);
                }
            });
        }
        else
        {
            this.template = new RouteTemplate();
        }

        this._changeDetector = new ChangeDetector(() => this.template);
    }

    /**
     * Called by the framework before the module is deactivated.
     * @returns A promise that will be resolved with true if the module should be deactivated, otherwise false.
     */
    public async canDeactivate(): Promise<boolean>
    {
        return this._changeDetector?.allowDiscard();
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
     * Called when the "Create route" button is clicked.
     * Shows the create route modal
     */
    protected async onCreateRouteClick(): Promise<void>
    {
        await this._modalService.open(CreateRoutePanel, this.template).promise;
    }

    /**
     * Called when the "Save changes" button is clicked.
     * Saves the template.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this.saving = true;

            if (!this.template.id)
            {
                await this._routeTemplateService.create(this.template);
            }
            else
            {
                await this._routeTemplateService.update(this.template);
            }

            this._changeDetector.markAsUnchanged();

            this.saving = false;
        }
        catch (error)
        {
            this.saving = false;
            Log.error("Could not save the template", error);
        }
    }
}
