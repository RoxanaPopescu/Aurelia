import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStopType, RouteStop, RouteService } from "app/model/route";
import { Log } from "shared/infrastructure";

@autoinject
export class RouteStopPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     */
    public constructor(routeService: RouteService)
    {
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;

    private _result: RouteStop | undefined;

    /**
     * True if the model represents a new stop, otherwise false.
     */
    protected isNew: boolean;

    /**
     * True if the model is in edit mode, otherwise false.
     */
    protected edit = false;

    /**
     * The model for the modal.
     */
    protected model: RouteStop;

    /**
     * The available types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => ({ slug, ...RouteStopType.values[slug] }));

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model?: RouteStop): void
    {
        this.isNew = model == null;
        this.model = model != null ? model.clone() : new RouteStop();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteStop | undefined>
    {
        if (!this.isNew)
        {
            this._result = this.model;
        }

        return this._result;
    }

    /**
     * Called when the "Edit" icon is clicked.
     * Transitions the modal to its edit mode.
     */
    protected onEditClick(): void
    {
        this.edit = true;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and transitions the modal to its readonly mode.
     */
    protected async onSaveClick(): Promise<void>
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

            await this._routeService.saveRouteStop(this.model);

            this.edit = false;
        }
        catch (error)
        {
            Log.error("Could not save the route stop", error);
        }
    }
}
