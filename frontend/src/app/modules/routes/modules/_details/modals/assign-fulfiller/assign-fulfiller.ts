import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal } from "shared/framework";
import { RouteAssignmentService, Route } from "app/model/route";
import { AgreementService } from "app/model/agreement";
import { Fulfiller } from "app/model/outfit";

@autoinject
export class AssignFulfillerPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(modal: Modal, routeAssignmentService: RouteAssignmentService, agreementService: AgreementService)
    {
        this._modal = modal;
        this._routeAssignmentService = routeAssignmentService;
        this._agreementService = agreementService;
    }

    private readonly _modal: Modal;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _agreementService: AgreementService;
    private _result: Fulfiller | undefined;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    protected queryText: string | undefined;

    /**
     * The route to which a fulfiller should be assigned.
     */
    protected route: Route;

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
    public activate(model: Route): void
    {
        this.route = model;

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
     */
    protected async onFulfillerClick(fulfiller: Fulfiller): Promise<void>
    {
        try
        {
            await this._routeAssignmentService.assignFulfiller(this.route, fulfiller);

            this._result = fulfiller;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign fulfiller", error);
        }
    }
}
