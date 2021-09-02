import { autoinject, computedFrom } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { OrganizationService, OrganizationRole } from "app/model/organization";
import { EditRolePanel } from "./modals/edit-role/edit-role";
import { ConfirmDeleteRoleDialog } from "./modals/confirm-delete-role/confirm-delete-role";

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
export class RolesPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, organizationService: OrganizationService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._organizationService = organizationService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _organizationService: OrganizationService;
    private readonly _historyHelper: HistoryHelper;
    private _roles: OrganizationRole[] | undefined;

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
        property: "name",
        direction: "ascending"
    };

    /**
     * The roles to present in the table.
     */
    @computedFrom("_roles.length", "sorting", "textFilter")
    protected get orderedAndFilteredRoles(): OrganizationRole[] | undefined
    {
        if (this._roles == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._roles

            // Filtering
            .filter(role => !this.textFilter || role.searchModel.contains(this.textFilter))

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
            this._roles = await this._organizationService.getRoles(signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the roles within the organization", error);
            }
        });
    }

    /**
     * Called when the `New role` button is clicked.
     * Opens a modal for creating a new role.
     */
    protected async onNewRoleClick(): Promise<void>
    {
        const newRole = await this._modalService.open(EditRolePanel, {}).promise;

        if (newRole != null)
        {
            this._roles!.push(newRole);
        }
    }

    /**
     * Called when a role, or its `Edit role` icon, is clicked.
     * Opens a modal for editing the role.
     * @param role The role to edit.
     */
    protected async onRoleClick(role: OrganizationRole): Promise<void>
    {
        const newRole = await this._modalService.open(EditRolePanel, { role, roles: this._roles }).promise;

        if (newRole != null)
        {
            this._roles!.splice(this._roles!.indexOf(role), 1, newRole);
        }
    }

    /**
     * Called when the `Duplicate` icon is clicked on a role.
     * Duplicates the role.
     * @param role The role to duplicate.
     */
    protected async onDuplicateRoleClick(role: OrganizationRole): Promise<void>
    {
        try
        {
            const newRole = await this._organizationService.duplicateRole(role.id);

            this._roles!.splice(this._roles!.indexOf(role), 0, newRole);
        }
        catch (error)
        {
            Log.error("Could not duplicate the role", error);
        }
    }

    /**
     * Called when the `Delete` icon is clicked on a role.
     * Asks for confirmation, then deletes the role.
     * @param role The role to delete.
     */
    protected async onDeleteRoleClick(role: OrganizationRole): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteRoleDialog, role).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            await this._organizationService.deleteRole(role.id);

            this._roles!.splice(this._roles!.indexOf(role), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the role", error);
        }
    }
}
