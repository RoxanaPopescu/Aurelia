import { autoinject, observable } from "aurelia-framework";
import { RouteSettingsService } from "app/model/route-settings";

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param routeSettingsService The `RouteSettingsService` instance.
     */
    public constructor(routeSettingsService: RouteSettingsService)
    {
        // this._routeSettingsService = routeSettingsService;
    }

    // private readonly _routeSettingsService: RouteSettingsService;

    /**
     * Current tab page the user is routed to.
     */
    @observable
    protected tab: "general" | "geographical-areas" | "vehicle-groups" | "start-location" | "task-times";

    /**
     * The id of the routeplan settings
     */
    protected settingsId: string;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: any): Promise<void>
    {
        this.tab = params.tab;
        this.settingsId = params.id;
    }
}
