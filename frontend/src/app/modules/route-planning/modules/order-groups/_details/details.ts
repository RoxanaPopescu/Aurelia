import { autoinject } from "aurelia-framework";
import { OrderGroupService, OrderGroup, MatchingCriteria } from "app/model/_order-group";
import { ModalService, IValidation } from "shared/framework";
import { MatchingCriteriaDialog } from "./modals/matching-criteria/matching-criteria";

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
     * @param modalService The `ModalService` instance.
     * @param orderGroupsService The `OrderGroupService` instance.
     */
    public constructor(modalService: ModalService, orderGroupsService: OrderGroupService)
    {
        this._modalService = modalService;
        this._orderGroupsService = orderGroupsService;
    }

    private readonly _modalService: ModalService;
    private readonly _orderGroupsService: OrderGroupService;

    /**
     * The original name of the order group.
     */
    protected orderGroupName: string;

    /**
     * The order group to present or edit.
     */
    protected orderGroup: OrderGroup;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

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
            this.orderGroupName = this.orderGroup.name;
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
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            await this._orderGroupsService.create(this.orderGroup);
        }
        catch (error)
        {
            // TODO: Show proper error message.
            alert(`Could not create order group: ${error}`);
        }
    }

    /**
     * Called when the `Save order group` button is clicked.
     * Saves the order group.
     */
    protected async onSaveClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            await this._orderGroupsService.update(this.orderGroup);
        }
        catch (error)
        {
            // TODO: Show proper error message.
            alert(`Could not save order group: ${error}`);
        }
    }

    /**
     * Called when the add matching criteria button is clicked.
     * Opens the new matching criteria dialog.
     */
    protected async onAddMatchingCriteriaClick(): Promise<void>
    {
        const matchingCriteria = new MatchingCriteria();
        const result = await this._modalService.open(MatchingCriteriaDialog, matchingCriteria).promise;

        if (result)
        {
            this.orderGroup.matchingCriterias.push(matchingCriteria);
        }
    }

    /**
     * Called when the remove icon on a matching criteria is clicked.
     * Removes the matching criteria from the model.
     * @param index The index of the matching criteria to remove.
     */
    protected onRemoveMatchingCriteriaClick(index: number): void
    {
        this.orderGroup.matchingCriterias.splice(index, 1);
    }

    /**
     * Called when the edit icon on a matching criteria is clicked.
     * Opens the edit matching criteria dialog.
     * @param index The index of the matching criteria to edit.
     */
    protected async onEditMatchingCriteriaClick(index: number): Promise<void>
    {
        const matchingCriteria = this.orderGroup.matchingCriterias[index].clone();
        const result = await this._modalService.open(MatchingCriteriaDialog, matchingCriteria).promise;

        if (result)
        {
            this.orderGroup.matchingCriterias.splice(index, 1, matchingCriteria);
        }
    }

    /**
     * Called when the add route planning time button is clicked.
     * Opens the new route planning time dialog.
     */
    protected onAddRoutePlanningTimeClick(): void
    {

    }

    /**
     * Called when the remove icon on a route planning time is clicked.
     * Removes the route planning time from the model.
     * @param index The index of the route planning time to remove.
     */
    protected onRemoveRoutePlanningTimeClick(index: number): void
    {
        this.orderGroup.routePlanningTimes.splice(index, 1);
    }

    /**
     * Called when the edit icon on a route planning time is clicked.
     * Opens the edit route planning time dialog.
     * @param index The index of the route planning time to edit.
     */
    protected onEditRoutePlanningTimeClick(index: number): void
    {

    }
}
