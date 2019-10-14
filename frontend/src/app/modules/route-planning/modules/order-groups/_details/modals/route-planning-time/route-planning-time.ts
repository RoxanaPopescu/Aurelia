import { autoinject } from "aurelia-framework";
import { DateTime, Duration, IANAZone } from "luxon";
import { Modal, IValidation } from "shared/framework";
import { RoutePlanningTime } from "app/model/_order-group";

interface IModel
{
    routePlanningTime: RoutePlanningTime;
    timeZone: IANAZone;
}

@autoinject
export class RoutePlanningTimeDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private result = false;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: IModel;

    /**
     * The date component of the next planning date.
     */
    protected nextPlanningDate: DateTime;

    /**
     * The time component of the next planning date.
     */
    protected nextPlanningTime: Duration;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use for the modal.
     */
    public activate(model: IModel): void
    {
        this.model = model;

        // Split the next planning date into separate date and time properties.
        if (model.routePlanningTime.nextPlanning != null)
        {
            this.nextPlanningDate = model.routePlanningTime.nextPlanning.startOf("day");
            this.nextPlanningTime = model.routePlanningTime.nextPlanning.diff(model.routePlanningTime.nextPlanning.startOf("day"));
        }
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the changes should be saved, false if the dialog was cancelled.
     */
    public deactivate(): boolean
    {
        return this.result;
    }

    /**
     * Called when the save button is clicked.
     */
    protected async onSaveClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        // Set the next planning date based on the separate date and time properties.
        this.model.routePlanningTime.nextPlanning = this.nextPlanningDate.plus(this.nextPlanningTime);

        // The to and from day are always the same.
        this.model.routePlanningTime.delivery.to!.dayOfWeek = this.model.routePlanningTime.delivery.from!.dayOfWeek;

        this.result = true;
        await this._modal.close();
    }
}
