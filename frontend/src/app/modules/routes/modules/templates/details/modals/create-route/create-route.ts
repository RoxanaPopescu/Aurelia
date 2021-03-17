import { autoinject } from "aurelia-framework";
import { Modal, IValidation, ModalService, ToastService } from "shared/framework";
import { RouteTemplate, RouteTemplateService } from "app/model/route-template";
import { RouteStatus } from "app/model/route";
import { AssignDriverPanel } from "app/modules/routes/modals/assign-driver/assign-driver";
import createdToast from "./resources/strings/created-toast.json";
import { CreateRoute } from "app/model/route-template/entities/create-route";
import { Log } from "shared/infrastructure";

@autoinject
export class CreateRoutePanel
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     * @param routeTemplateService The `RouteTemplateService` instance.
     */
    public constructor(
        modal: Modal,
        modalService: ModalService,
        toastService: ToastService,
        routeTemplateService: RouteTemplateService)
    {
        this._modal = modal;
        this._modalService = modalService;
        this._toastService = toastService;
        this._routeTemplateService = routeTemplateService;
    }

    private readonly _modal: Modal;
    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
    private readonly _routeTemplateService: RouteTemplateService;

    /**
     * The route structure to be created.
     */
    protected model: CreateRoute;

    /**
     * The possible statuses
     */
    protected statuses: RouteStatus[] = [new RouteStatus("not-started"), new RouteStatus("not-approved")];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The template
     */
    public activate(model: RouteTemplate): void
    {
        this.model = new CreateRoute(model);
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<void>
    {
        return;
    }

    /**
     * Called when the "Assign driver" button is clicked.
     */
    protected async onAssignDriverClick(): Promise<void>
    {
        const driver = await this._modalService.open(
            AssignDriverPanel
        ).promise;

        if (driver != null)
        {
            this.model.driver = driver;
        }
    }

    /**
     * Called when the "Remove driver" icon is clicked.
     */
    protected onRemoveDriverClick(): void
    {
        this.model.driver = undefined;
    }

    /**
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this._modal.busy = true;

            await this._routeTemplateService.createRoute(this.model);

            this._toastService.open("success", createdToast);

            await this._modal.close();
        }
        catch (error)
        {
            this._modal.busy = false;
            Log.error("Could not create the route from the template", error);
        }
    }
}
