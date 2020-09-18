import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { RouteTemplateService, RouteTemplate, RouteTemplateSchedule } from "app/model/route-template";
import { RouteStatus } from "app/model/route";
import { Log } from "shared/infrastructure";

@autoinject
export class TemplateScheduleDetailsPanel
{
    /**
     * Creates a new instance of the type.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        modal: Modal)
    {
        this._routeTemplateService = routeTemplateService;
        this._modal = modal;
    }

    private readonly _routeTemplateService: RouteTemplateService;
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
     * The possible statuses
     */
    protected statuses: RouteStatus[] = [new RouteStatus("not-started"), new RouteStatus("not-approved")];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { template: RouteTemplate, schedule: RouteTemplateSchedule}): void
    {
        this.model = model.schedule.clone();
        this.template = model.template;

        // FIXME: FETCH DRIVER
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

            // Mark the modal as busy.
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
