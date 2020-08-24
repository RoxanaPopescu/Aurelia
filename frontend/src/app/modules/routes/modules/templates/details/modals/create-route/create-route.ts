import { autoinject } from "aurelia-framework";
import { Modal, IValidation, ModalService, ToastService } from "shared/framework";
import { RouteTemplate } from "app/model/route-template";
import { DateTime } from "luxon";
import { RouteStatus } from "app/model/route";
import { Driver } from "app/model/driver";
import { AssignDriverPanel } from "app/modules/routes/modals/assign-driver/assign-driver";
import createdToast from "./resources/strings/created-toast.json";

@autoinject
export class CreateRoutePanel
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param toastService The `ToastService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modal: Modal, modalService: ModalService, toastService: ToastService)
    {
        this._modal = modal;
        this._modalService = modalService;
        this._toastService = toastService;
    }

    private readonly _modal: Modal;
    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;

    /**
     * The model for the modal.
     */
    protected template: RouteTemplate;

    /**
     * The date of which the route is executed
     */
    protected date: DateTime;

    /**
     * The status of the created route
     */
    protected status: RouteStatus;

    /**
     * The driver for the route
     */
    protected driver: Driver;

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
        this.template = model;
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
            this.driver = driver;
        }
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

        // Mark the modal as busy.
        this._modal.busy = true;

        const newRoutesSlug = "fixme-slug";
        createdToast.body = createdToast.body.replace("{routeSlug}", newRoutesSlug);
        createdToast.url = createdToast.url.replace("{routeSlug}", newRoutesSlug);

        this._toastService.open(
            "info",
            createdToast
        );

        await this._modal.close();
    }
}
