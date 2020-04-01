import { autoinject, observable } from "aurelia-framework";
import { RoutePlanningSettingsService, RoutePlanningSettings as RoutePlanningSettings } from "app/model/_route-planning-settings";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route planning settings, or undefined if new.
     */
    id?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param routePlanningSettingsService The `RoutePlanningSettingsService` instance.
     */
    public constructor(routePlanningSettingsService: RoutePlanningSettingsService)
    {
        this._routePlanningSettingsService = routePlanningSettingsService;
    }

    private readonly _routePlanningSettingsService: RoutePlanningSettingsService;

    /**
     * Current tab page the user is routed to.
     */
    @observable
    protected tab: "general" | "geographic-areas" | "vehicle-groups" | "start-locations" | "task-times";

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The route planning rule set.
     */
    protected settings: RoutePlanningSettings;

    /**
     * True if the route planning rule set is new, otherwise false.
     */
    protected isNew: boolean;

    /**
     * True if the rule set is being updated, otherwise false.
     */
    protected updating: boolean = false;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        this.tab = "general";
        this.isNew = params.id == null;

        if (!this.isNew)
        {
            this.settings = await this._routePlanningSettingsService.get(params.id!);
        }
        else
        {
            this.settings = new RoutePlanningSettings();
        }
    }

    /**
     * Called when the "Save changes" button is clicked.
     * Saves the route plannign settings.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        this.updating = true;

        try
        {
            if (this.isNew)
            {
                await this._routePlanningSettingsService.create(this.settings);

                this.isNew = false;
            }
            else
            {
                await this._routePlanningSettingsService.update(this.settings);
            }

            this.updating = false;
        }
        catch (error)
        {
            this.updating = false;
            Log.error("Could not save the route planning settings", error);
        }
    }
}
