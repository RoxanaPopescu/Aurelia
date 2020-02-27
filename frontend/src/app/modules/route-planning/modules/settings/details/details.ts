import { autoinject, observable } from "aurelia-framework";
import { RouteStatusSlug, RouteInfo } from "app/model/route";

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor()
    {
    }

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: RouteStatusSlug | undefined = "requested";

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected routes: RouteInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(): Promise<void>
    {

    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        /* if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
        */
    }
}
