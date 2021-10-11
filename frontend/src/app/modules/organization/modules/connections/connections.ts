import { autoinject, computedFrom } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService, ToastService } from "shared/framework";
import { OrganizationService, OrganizationConnection } from "app/model/organization";
import { InviteConnectionPanel } from "./modals/invite-connection/invite-connection";
import { ConfirmCancelInviteDialog } from "./modals/confirm-cancel-invite/confirm-cancel-invite";
import { ConfirmDeleteConnectionDialog } from "./modals/confirm-delete-connection/confirm-delete-connection";
import { ConfirmAcceptConnectionDialog } from "./modals/confirm-accept-connection/confirm-accept-connection";
import acceptToastStrings from "./resources/strings/accept-toast.json";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    sortProperty?: string;
    sortDirection?: SortingDirection;
    text?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ConnectionsPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, toastService: ToastService, organizationService: OrganizationService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._toastService = toastService;
        this._organizationService = organizationService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
    private readonly _organizationService: OrganizationService;
    private readonly _historyHelper: HistoryHelper;
    private _connections: OrganizationConnection[] | undefined;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The text filter to apply, if any.
     */
    protected textFilter: string | undefined;

    /**
     * The sorting to use for the table.
     */
    protected sorting: ISorting =
    {
        property: "fullName",
        direction: "ascending"
    };

    /**
     * The connections to present in the table.
     */
    @computedFrom("_connections.length", "sorting", "textFilter")
    protected get orderedAndFilteredConnections(): OrganizationConnection[] | undefined
    {
        if (this._connections == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._connections

            // Filtering
            .filter(connection => !this.textFilter || connection.searchModel.contains(this.textFilter))

            // Sorting
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property)?.toString();
                const bPropertyValue = getPropertyValue(b, this.sorting.property)?.toString();

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.text || this.textFilter;

        this.fetch();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();
    }

    /**
     * Called by the framework when the `textFilter` property changes.
     */
    public textFilterChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.text = this.textFilter || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Called by the framework when the `sorting` property changes.
     */
    public sortingChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.sortProperty = this.sorting?.property || undefined;
            state.params.sortDirection = this.sorting?.direction || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Fetches the latest data.
     */
    protected fetch(): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._connections = await this._organizationService.getConnections(signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the connections within the organization", error);
            }
        });
    }

    /**
     * Called when the `Invite connection` button is clicked.
     * Opens a modal for inviting a connection to join the organization.
     */
    protected async onInviteConnectionClick(): Promise<void>
    {
        const newConnection = await this._modalService.open(InviteConnectionPanel).promise;

        if (newConnection != null)
        {
            this._connections!.unshift(newConnection);
        }
    }

    /**
     * Called when the `Accept invite` icon is clicked on a connection.
     * Asks for confirmation, then accepts the invite.
     * @param connection The connection to accept.
     */
    protected async onAcceptInviteClick(connection: OrganizationConnection): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmAcceptConnectionDialog, connection).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            const acceptedConnection = await this._organizationService.acceptConnection(connection.id);

            this._connections!.splice(this._connections!.indexOf(connection), 1, acceptedConnection);

            if (false)
            {
                this._toastService.open("success",
                {
                    // tslint:disable-next-line: no-invalid-template-strings
                    heading: acceptToastStrings.heading.replace("${organizationName}", connection.organization.name)
                });
            }
        }
        catch (error)
        {
            Log.error("Could not accept the invite", error);
        }
    }

    /**
     * Called when the `Delete` icon is clicked on a connection.
     * Asks for confirmation, then deletes the connection.
     * @param connection The connection to delete.
     */
    protected async onDeleteConnectionClick(connection: OrganizationConnection): Promise<void>
    {
        const modalType = connection.status.slug !== "active" ? ConfirmCancelInviteDialog : ConfirmDeleteConnectionDialog;
        const confirmed = await this._modalService.open(modalType as any, connection).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._organizationService.deleteConnection(connection.id);

            this._connections!.splice(this._connections!.indexOf(connection), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the connection", error);
        }
    }
}
