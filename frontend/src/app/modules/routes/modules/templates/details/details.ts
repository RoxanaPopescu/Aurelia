import { autoinject, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { RouteTemplateService, RouteTemplate } from "app/model/route-template";
import { ConfirmDeleteTemplateDialog } from "./modals/confirm-delete-template/confirm-delete-template";
import { Log } from "shared/infrastructure";
import { AppRouter } from "aurelia-router";
import { ModalService, IValidation, ToastService } from "shared/framework";
import toast from "./resources/strings/toast.json";

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
     * @param router The `AppRouter` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        modalService: ModalService,
        router: AppRouter,
        toastService: ToastService
    ){
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
        this._router = router;
        this._toastService = toastService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;
    private readonly _router: AppRouter;
    private readonly _toastService: ToastService;

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
                try {
                    this.template = await this._routeTemplateService.get(params.id!, signal);
                } catch (error) {
                    Log.error("An error occurred while loading the details.\n", error);
                }
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

    /**
     * Called when the "Delete template" button is clicked.
     * Deletes the template.
     */
    protected async onDeleteClick(): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteTemplateDialog).promise)
        {
            return;
        }

        try
        {
            await this._routeTemplateService.delete(this.template.id);

            this._router.navigate("/routes/templates");
        }
        catch (error)
        {
            Log.error("Could not delete template", error);
        }

    }

    /**
     * Called when the "Save template" button is clicked.
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
            let toastHeading: string;
            this.saving = true;

            if (!this.template.id)
            {
                await this._routeTemplateService.create(this.template);

                toastHeading = toast["heading-created"];
            }
            else
            {
                await this._routeTemplateService.update(this.template);

                toastHeading = toast["heading-updated"];
            }

            this.saving = false;
            this._toastService.open("info",
            {
                "heading": toastHeading
            });
        }
        catch (error)
        {
            this.saving = false;
            Log.error("Could not save template", error);
        }

    }
}
