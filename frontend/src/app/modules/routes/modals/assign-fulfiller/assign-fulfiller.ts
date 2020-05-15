import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, ModalService } from "shared/framework";
import { RouteAssignmentService, RouteBase } from "app/model/route";
import { AgreementService } from "app/model/agreement";
import { Fulfiller } from "app/model/outfit";
import { ConfirmRemoveFulfillerDialog } from "./confirm-remove-fulfiller/confirm-remove-fulfiller";
import { IdentityService } from "app/services/identity";

@autoinject
export class AssignFulfillerPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(modal: Modal, modalService: ModalService, identityService: IdentityService, routeAssignmentService: RouteAssignmentService, agreementService: AgreementService)
    {
        this._modal = modal;
        this._modalService = modalService;
        this.identityService = identityService;
        this._routeAssignmentService = routeAssignmentService;
        this._agreementService = agreementService;
    }

    private readonly _modal: Modal;
    private readonly _modalService: ModalService;
    protected readonly identityService: IdentityService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _agreementService: AgreementService;
    private _result: Fulfiller | undefined;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    protected queryText: string | undefined;

    /**
     * The route to which a driver should be assigned
     */
    protected route: RouteBase;

    /**
     * If the driver should be assigned within this modal
     */
    protected assignOnSelect: boolean;

    /**
     * The available fulfillers.
     */
    protected fulfillers: Fulfiller[] | undefined;

    /**
     * The available fulfillers, filtered to include only those matching the route requirements and query text.
     */
    @computedFrom("fulfillers", "queryText")
    protected get filteredFulfillers(): Fulfiller[] | undefined
    {
        if (this.fulfillers == null)
        {
            return undefined;
        }

        if (!this.queryText)
        {
            return this.fulfillers;
        }

        const text = this.queryText.toLowerCase();

        return this.fulfillers

            .filter(d =>
                d.id.toString().includes(text) ||
                d.primaryName.toString().toLowerCase().includes(text) ||
                d.contactPhone && d.contactPhone.toString().toLowerCase().includes(text));
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { route: RouteBase, assignOnSelect: boolean }): void
    {
        this.route = model.route;
        this.assignOnSelect = model.assignOnSelect;

        // tslint:disable-next-line: no-unused-expression
        new Operation(async () =>
        {
            const agreements = await this._agreementService.getAll();
            this.fulfillers = agreements.agreements.filter(c => c.type.slug === "fulfiller");
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected fulfiller, or undefined if cancelled.
     */
    public async deactivate(): Promise<Fulfiller | undefined>
    {
        return this._result;
    }

    /**
     * Called when a fulfiller in the list of fulfillers is clicked.
     * Assigns the fulfiller to the route and closes the modal.
     * If the fulfiller of the route is not the current user,
     * we are removing fulfillers, therefore we confirm it.
     */
    protected async onFulfillerClick(fulfiller: Fulfiller): Promise<void>
    {
        if (this.route.fulfiller.id != this.identityService.identity?.outfit.id) {
            const confirmed = await this._modalService.open(
                ConfirmRemoveFulfillerDialog,
                {
                    currentFulfiller: this.route.fulfiller,
                    newFulfiller: fulfiller
                }
            ).promise;

            if (!confirmed)
            {
                return;
            }
        }

        try
        {
            if (this.assignOnSelect) {
                this._modal.busy = true;
                await this._routeAssignmentService.assignFulfiller(this.route, fulfiller, this.identityService.identity!.outfit);
            }

            this._result = fulfiller;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign fulfiller", error);
            this._modal.busy = false;
        }
    }
}
