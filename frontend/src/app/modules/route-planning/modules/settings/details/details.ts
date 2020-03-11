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
     * The id of the routeplan settings
     */
    protected settings: RoutePlanningSettings;

    /**
     * The id of the routeplan settings
     */
    protected isNew: boolean;

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

        try
        {
            await this._routePlanningSettingsService.update(this.settings);
        }
        catch (error)
        {
            Log.error("Could not save the route planning settings", error);
        }
    }
}
