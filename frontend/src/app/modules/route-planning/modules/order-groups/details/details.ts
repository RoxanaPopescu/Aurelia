import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { ModalService, IValidation, ToastService } from "shared/framework";
import { Consignor } from "app/model/outfit";
import { AgreementService } from "app/model/agreement";
import { OrderGroupService, OrderGroup, MatchingCriteria, RoutePlanningTime } from "app/model/order-group";
import { MatchingCriteriaDialog } from "./modals/matching-criteria/matching-criteria";
import { RoutePlanningTimeDialog } from "./modals/route-planning-time/route-planning-time";
import updatedToast from "./resources/strings/updated-toast.json";

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
     * @param toastService The `ToastService` instance.
     */
    public constructor(
        modalService: ModalService,
        orderGroupsService: OrderGroupService,
        agreementService: AgreementService,
        toastService: ToastService
    ){
        this._modalService = modalService;
        this._orderGroupsService = orderGroupsService;
        this._agreementService = agreementService;
        this._toastService = toastService;
    }

    private readonly _modalService: ModalService;
    private readonly _orderGroupsService: OrderGroupService;
    private readonly _agreementService: AgreementService;
    private readonly _toastService: ToastService;
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
        else
        {
            this.orderGroup = new OrderGroup();
        }

        // Execute tasks that should not block rendering.

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            // Fetch available consignors.
            const agreements = await this._agreementService.getAll();
            this.availableConsignors = agreements.agreements.filter(c => c.type.slug === "consignor");
        })();

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            // Fetch available tags.
            this.availableTags = await this._orderGroupsService.getAllTags();
        })();
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
            this.orderGroup = await this._orderGroupsService.create(this.orderGroup);
        }
        catch (error)
        {
            Log.error("Could not create order group", error);
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
            this.orderGroup = await this._orderGroupsService.update(this.orderGroup);
            this._toastService.open(
                "info",
                updatedToast
            );
        }
        catch (error)
        {
            Log.error("Could not save order group", error);
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

    /**
     * Called when the pause button is clicked.
     * Pauses the order group.
     */
    protected async onPauseClick(): Promise<void>
    {
        try
        {
            const result = await this._orderGroupsService.pause(this.orderGroup);

            this.orderGroup.etag = result.etag;
            this.orderGroup.paused = true;
        }
        catch (error)
        {
            Log.error("Could not pause order group", error);
        }
    }

    /**
     * Called when the unpause button is clicked.
     * Unpauses the order group.
     */
    protected async onUnpauseClick(): Promise<void>
    {
        try
        {
            const result = await this._orderGroupsService.unpause(this.orderGroup);

            this.orderGroup.etag = result.etag;
            this.orderGroup.paused = false;
        }
        catch (error)
        {
            Log.error("Could not unpause order group", error);
        }
    }
}