import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, ModalService } from "shared/framework";
import { RouteAssignmentService, RouteBase } from "app/model/route";
import { ConfirmRemoveOrganizationDialog } from "./confirm-remove-fulfiller/confirm-remove-organization";
import { IdentityService } from "app/services/identity";
import { OrganizationConnection, OrganizationService } from "app/model/organization";

@autoinject
export class AssignOrganizationPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(modal: Modal, modalService: ModalService, identityService: IdentityService, routeAssignmentService: RouteAssignmentService, organizationService: OrganizationService)
    {
        this._modal = modal;
        this._modalService = modalService;
        this.identityService = identityService;
        this._routeAssignmentService = routeAssignmentService;
        this._organizationService = organizationService;
    }

    private readonly _modal: Modal;
    private readonly _modalService: ModalService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _organizationService: OrganizationService;
    private _result: OrganizationConnection | undefined;

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

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
     * The available connections.
     */
    protected connections: OrganizationConnection[] | undefined;

    /**
     * The available organizations, filtered to include only those matching the route requirements and query text.
     */
    @computedFrom("connections", "queryText")
    protected get filteredConnections(): OrganizationConnection[] | undefined
    {
        if (this.connections == null)
        {
            return undefined;
        }

        if (!this.queryText)
        {
            return this.connections;
        }

        const textFilter = this.queryText.toLowerCase();

        return this.connections
            .filter(connection => !textFilter || connection.searchModel.contains(textFilter));
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { route: RouteBase; assignOnSelect: boolean }): void
    {
        this.route = model.route;
        this.assignOnSelect = model.assignOnSelect;

        // tslint:disable-next-line: no-unused-expression
        new Operation(async () =>
        {
            this.connections = await this._organizationService.getConnections();
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected fulfiller, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationConnection | undefined>
    {
        return this._result;
    }

    /**
     * Called when a organization in the list of organizations is clicked.
     * Assigns the organization to the route and closes the modal.
     * If the organization of the route is not the current user,
     * we are removing organization, therefore we confirm it.
     */
    protected async onOrganizationClick(connection: OrganizationConnection): Promise<void>
    {
        if (this.route.executor.id !== this.identityService.identity?.organization!.id)
        {
            const confirmed = await this._modalService.open(ConfirmRemoveOrganizationDialog,
            {
                currentExecutor: this.route.executor,
                newExecutor: connection
            }).promise;

            if (!confirmed)
            {
                return;
            }
        }

        try
        {
            if (this.assignOnSelect)
            {
                this._modal.busy = true;
                await this._routeAssignmentService.assignExecutor(this.route, connection, this.identityService.identity!.organization);
            }

            this._result = connection;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign fulfiller", error);
            this._modal.busy = false;
        }
    }
}
