import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { IValidation } from "shared/framework";
import { Log } from "shared/infrastructure";
import { RouteService, Route } from "app/model/route";

@autoinject
export class AddSupportNoteDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param routeService The `RouteService` instance.
     */
    public constructor(modal: Modal, routeService: RouteService)
    {
        this._modal = modal;
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;
    private readonly _modal: Modal;
    private note?: string;
    private _result: boolean = false;
    /**
     * The model for the modal.
     */
    protected model: { route: Route };


    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { route: Route }): void
    {
        this.model = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns Returns null.
     */
    public deactivate(): boolean
    {
        return this._result;
    }

    /**
     * Called when the user clicks the cancel button.
     */
    protected async onCancelClick(result: boolean): Promise<void>
    {
        await this._modal.close();
    }

    /**
     * Called when the note is to be added.
     */
    protected async onAddClick(): Promise<void>
    {
        try {
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this._modal.busy = true;

            await this._routeService.addSupportNote(this.model.route, this.note!);

            this._result = true;
            await this._modal.close(this.note);
        } catch (error)
        {
            Log.error("Could not add a support note for this route", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
