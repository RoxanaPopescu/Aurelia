import { autoinject, bindable } from "aurelia-framework";
import { RouteTemplate, RouteTemplateSchedule, RouteTemplateService } from "app/model/route-template";
import { RouteStatus } from "app/model/route";
import { IValidation, ModalService, ToastService } from "shared/framework";
import { TemplateScheduleDetailsPanel } from "./modals/details/details";
import { Log } from "shared/infrastructure";

/**
 * Represents the page.
 */
@autoinject
export class Schedules
{
    /**
     * Creates a new instance of the class.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        modalService: ModalService,
        toastService: ToastService
    ){
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
        this._toastService = toastService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;
    protected readonly _toastService: ToastService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The template to present.
     */
    @bindable
    protected template: RouteTemplate;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStatus.values).map(slug => new RouteStatus(slug as any));

    /**
     * Called when the "Add schedule" button is clicked.
     * Opens at modal for creating a new schedule.
     */
    protected async onAddClick(index?: number): Promise<void>
    {
        const newSchedule = new RouteTemplateSchedule();
        const savedSchedule = await this._modalService.open(TemplateScheduleDetailsPanel, { template: this.template, schedule: newSchedule }).promise;

        if (savedSchedule != null)
        {
            this.template.schedules.push(savedSchedule);
        }
    }

    /**
     * Called when the "Edit schedule" icon is clicked on a schedule.
     * Opens at modal for editing the schedule.
     * @param stop The stop to edit.
     */
    protected async onEditClick(schedule: RouteTemplateSchedule): Promise<void>
    {
        const newStop = await this._modalService.open(TemplateScheduleDetailsPanel, { template: this.template, schedule: schedule }).promise;

        if (newStop != null)
        {
            this.template.schedules.splice(this.template.schedules.indexOf(schedule), 1, newStop);
        }
    }

    /**
     * Called when the "Pause schedule" icon is clicked on a schedule.
     * Opens at modal for editing the schedule.
     * @param stop The stop to edit.
     */
    protected async onPauseClick(schedule: RouteTemplateSchedule): Promise<void>
    {
        try
        {
            const _schedule: RouteTemplateSchedule = schedule.clone();
            _schedule.paused = !_schedule.paused;
            await this._routeTemplateService.updateSchedule(this.template, _schedule);

            this.template.schedules.splice(this.template.schedules.indexOf(schedule), 1, _schedule);
        }
        catch (error)
        {
            Log.error("Could not pause / unpause the schedule", error);
        }
    }

    /**
     * Called when the "Remove stop" icon is clicked on a stop.
     * Removes the stop from teh template.
     * @param index The index of teh stop to remove.
     */
    protected async onRemoveClick(index: number): Promise<void>
    {
        try
        {
            const schedule = this.template.schedules[index];
            await this._routeTemplateService.deleteSchedule(schedule.id);

            this.template.schedules.splice(index, 1);
        }
        catch (error)
        {
            Log.error("Could not delete the schedule", error);
        }
    }
}
