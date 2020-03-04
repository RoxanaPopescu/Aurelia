/**
 * Represents the settings to use when creating the routes.
 */
export class RouteCreation
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.routeTags = data.routeTags;
            this.manualApproval = data.manualApproval;
            this.routeNameTemplate = data.routeNameTemplate;
        }
        else
        {
            this.routeTags = [];
            this.manualApproval = false;
        }
    }

    /**
     * The tags that should be associate with the routes.
     */
    public routeTags: string[];

    /**
     * True if the routes must be manually approved, otherwise false.
     */
    public manualApproval: boolean;

    /**
     * The route template from which routes should be created.
     */
    public routeNameTemplate: string;
}
