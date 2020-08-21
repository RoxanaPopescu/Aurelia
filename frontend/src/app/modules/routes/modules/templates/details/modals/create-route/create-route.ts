import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { RouteTemplate } from "app/model/route-template";
import { DateTime } from "luxon";
import { RouteStatus } from "app/model/route";

@autoinject
export class CreateRoutePanel
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
     * The id of the driver
     */
    protected driverId: string;

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
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        //this._result = this.model;

        // FIXME: LOADING

        await this._modal.close();
    }
}
