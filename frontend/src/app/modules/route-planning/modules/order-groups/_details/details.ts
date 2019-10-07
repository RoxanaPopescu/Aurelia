import { autoinject } from "aurelia-framework";
import { OrderGroupService, OrderGroup } from "app/model/_order-group";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
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
     * @param orderGroupsService The `OrderGroupService` instance.
     */
    public constructor(orderGroupsService: OrderGroupService)
    {
        this._orderGroupsService = orderGroupsService;
    }

    private readonly _orderGroupsService: OrderGroupService;

    /**
     * The order group to present or edit.
     */
    protected orderGroup: OrderGroup;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        if (params.id)
        {
            // Fetch the data.
            this.orderGroup = await this._orderGroupsService.get(params.id);
        }
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // TODO: Ask to save changes.
    }

    /**
     * Called when the `Create order group` button is clicked.
     * Creates the order group.
     */
    protected async onCreateClick(): Promise<void>
    {
        await this._orderGroupsService.create(this.orderGroup);
    }

    /**
     * Called when the `Save order group` button is clicked.
     * Saves the order group.
     */
    protected async onSaveClick(): Promise<void>
    {
        await this._orderGroupsService.update(this.orderGroup);
    }
}
