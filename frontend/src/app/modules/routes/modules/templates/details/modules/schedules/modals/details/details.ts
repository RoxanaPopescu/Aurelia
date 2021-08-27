import { autoinject, observable } from "aurelia-framework";
import { Modal, IValidation, ModalService } from "shared/framework";
import { RouteTemplateService, RouteTemplate, RouteTemplateSchedule } from "app/model/route-template";
import { RouteStatus } from "app/model/route";
import { Log } from "shared/infrastructure";
import { AssignDriverPanel } from "app/modules/routes/modals/assign-driver/assign-driver";
import { Driver, DriverService } from "app/model/driver";
import { DateTime, Duration, IANAZone } from "luxon";
import { DayOfWeek } from "app/model/shared";

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
    protected driver?: Driver;

    /**
     * The day of the week this schedule is being executed
     */
    @observable
    protected executeDayOfWeek: DayOfWeek;

    /**
     * The time of day at which this schedule is being executed.
     */
    @observable
    protected executeTime: Duration;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { template: RouteTemplate; schedule: RouteTemplateSchedule}): void
    {
        this.model = model.schedule.clone();
        this.timeZone = model.schedule.timeZone?.name;
        this.template = model.template;
        this.executeDayOfWeek = this.model.executeDayOfWeek;
        this.executeTime = this.model.executeTime;

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
     * @returns The edited route template schedule, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteTemplateSchedule | undefined>
    {
        return this._result;
    }

    /**
     * Update the model and check if the next execution should be set.
     */
    protected executeDayOfWeekChanged(): void
    {
        this.model.executeDayOfWeek = this.executeDayOfWeek;
        this.addDefaultExecutionIfNeeded();
    }

    /**
     * Update the model and check if the next execution should be set.
     */
    protected executeTimeChanged(): void
    {
        this.model.executeTime = this.executeTime;
        this.addDefaultExecutionIfNeeded();
    }

    /**
     * If time and day is set, this will default the execution datetime.
     */
    protected addDefaultExecutionIfNeeded(): void
    {
        if (this.model.executeTime == null || this.model.executeDayOfWeek == null || this.model.nextExecution != null)
        {
            return;
        }

        const now = DateTime.local();
        const weekday = now.weekday;

        const nextExecution = now.startOf("day").plus(this.model.executeTime);
        if (weekday === this.model.executeDayOfWeek)
        {
            const durationInDay = now.diff(DateTime.local().startOf("day"));
            if (durationInDay > this.model.executeTime)
            {
                this.model.nextExecution = nextExecution.plus({ days: 7 });
            }
            else
            {
                this.model.nextExecution = nextExecution;
            }
        }
        else
        {
            const difference = Math.abs(this.model.executeDayOfWeek - weekday);
            this.model.nextExecution = nextExecution.plus({ days: difference + 1 });
        }
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
    protected onRemoveDriverClick(): void
    {
        this.driver = undefined;
    }

    /**
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        try
        {
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

            if (this.model.id)
            {
                await this._routeTemplateService.updateSchedule(this.template, this.model);
            }
            else
            {
                await this._routeTemplateService.addSchedule(this.template, this.model);
            }

            this._result = this.model;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while adding the schedule.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
