import { autoinject } from "aurelia-framework";
import { ModalService, IValidation } from "shared/framework";
import { OrderGroupService, OrderGroup, MatchingCriteria, RoutePlanningTime } from "app/model/_order-group";
import { AgreementService } from "app/model/agreement";
import { Consignor } from "app/model/outfit";
import { MatchingCriteriaDialog } from "./modals/matching-criteria/matching-criteria";
import { RoutePlanningTimeDialog } from "./modals/route-planning-time/route-planning-time";

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
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(modalService: ModalService, orderGroupsService: OrderGroupService, agreementService: AgreementService)
    {
        this._modalService = modalService;
        this._orderGroupsService = orderGroupsService;
        this._agreementService = agreementService;
    }

    private readonly _modalService: ModalService;
    private readonly _orderGroupsService: OrderGroupService;
    private readonly _agreementService: AgreementService;
    private availableConsignors: Consignor[];
    private availableTags: string[];

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

        // Fetch available consignors.
        const agreements = await this._agreementService.getAll();
        this.availableConsignors = agreements.agreements.filter(c => c.type.slug === "consignor");

        // Fetch available tags.
        this.availableTags = await this._orderGroupsService.getAllTags();
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
        const result = await this._modalService.open(MatchingCriteriaDialog,
        {
            matchingCriteria,
            tags: this.availableTags,
            consignors: this.availableConsignors
        }).promise;

        if (result)
        {
            this.orderGroup.matchingCriteria.push(matchingCriteria);
        }
    }

    /**
     * Called when the remove icon on a matching criteria is clicked.
     * Removes the matching criteria from the model.
     * @param index The index of the matching criteria to remove.
     */
    protected onRemoveMatchingCriteriaClick(index: number): void
    {
        this.orderGroup.matchingCriteria.splice(index, 1);
    }

    /**
     * Called when the edit icon on a matching criteria is clicked.
     * Opens the edit matching criteria dialog.
     * @param index The index of the matching criteria to edit.
     */
    protected async onEditMatchingCriteriaClick(index: number): Promise<void>
    {
        const matchingCriteria = this.orderGroup.matchingCriteria[index].clone();
        const result = await this._modalService.open(MatchingCriteriaDialog,
        {
            matchingCriteria,
            tags: this.availableTags,
            consignors: this.availableConsignors
        }).promise;

        if (result)
        {
            this.orderGroup.matchingCriteria.splice(index, 1, matchingCriteria);
        }
    }

    /**
     * Called when the add route planning time button is clicked.
     * Opens the new route planning time dialog.
     */
    protected async onAddRoutePlanningTimeClick(): Promise<void>
    {
        const routePlanningTime = new RoutePlanningTime(this.orderGroup.timeZone);
        const result = await this._modalService.open(RoutePlanningTimeDialog,
        {
            routePlanningTime,
            timeZone: this.orderGroup.timeZone
        }).promise;

        if (result)
        {
            this.orderGroup.routePlanningTimes.push(routePlanningTime);
        }
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
    protected async onEditRoutePlanningTimeClick(index: number): Promise<void>
    {
        const routePlanningTime = this.orderGroup.routePlanningTimes[index].clone();
        const result = await this._modalService.open(RoutePlanningTimeDialog,
        {
            routePlanningTime,
            timeZone: this.orderGroup.timeZone
        }).promise;

        if (result)
        {
            this.orderGroup.routePlanningTimes.splice(index, 1, routePlanningTime);
        }
    }
}