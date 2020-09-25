import { autoinject } from "aurelia-framework";
import { Modal, IValidation, ModalService } from "shared/framework";
import { RouteTemplateService, RouteTemplate, RouteTemplateSchedule } from "app/model/route-template";
import { RouteStatus } from "app/model/route";
import { Log } from "shared/infrastructure";
import { AssignDriverPanel } from "app/modules/routes/modals/assign-driver/assign-driver";
import { Driver, DriverService } from "app/model/driver";
import { IANAZone } from "luxon";

@autoinject
export class TemplateScheduleDetailsPanel
{
    /**
     * Creates a new instance of the type.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param modalService The `ModalService` instance.
     * @param driverService The `DriverService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        modalService: ModalService,
        driverService: DriverService,
        modal: Modal)
    {
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
        this._driverService = driverService;
        this._modal = modal;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;
    private readonly _driverService: DriverService;
    private readonly _modal: Modal;
    private _result: RouteTemplateSchedule | undefined;

    /**
     * The template.
     */
    protected template: RouteTemplate;

    /**
     * The model for the modal.
     */
    protected model: RouteTemplateSchedule;

    /**
     * The timezone for the schedule.
     */
    protected timeZone: string;

    /**
     * The possible statuses
     */
    protected statuses: RouteStatus[] = [new RouteStatus("not-started"), new RouteStatus("not-approved")];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The driver for the route
     */
    public driver?: Driver;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { template: RouteTemplate, schedule: RouteTemplateSchedule}): void
    {
        this.model = model.schedule.clone();
        this.timeZone = model.schedule.timeZone?.name;
        this.template = model.template;

        // Fetch driver if exists
        if (this.model.routeDriverId)
        {
            // tslint:disable-next-line: no-floating-promises
            (async () =>
            {
                this.driver = await this._driverService.get(this.model.routeDriverId!);
            })();
        }
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteTemplateSchedule | undefined>
    {
        return this._result;
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
     * Called when the "Remove driver" icon is clicked.
     */
    protected async onRemoveDriverClick(): Promise<void>
    {
        this.driver = undefined;
    }

    /**
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        try {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this.model.timeZone = new IANAZone(this.timeZone) ?? "Europe/Copenhagen";
            this.model.routeDriverId = this.driver?.id;
            this._modal.busy = true;

            if (this.model.id) {
                await this._routeTemplateService.updateSchedule(this.template, this.model);
            } else {
                await this._routeTemplateService.addSchedule(this.template, this.model);
            }

            this._result = this.model;
            await this._modal.close();
        } catch (error) {
            Log.error("An error occurred while adding the schedule.\n", error);
        } finally {
            this._modal.busy = false;
        }
    }
}
