import { autoinject } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationRole } from "app/model/organization";
import { EditRolePanel } from "./modals/edit-role/edit-role";

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
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, identityService: IdentityService, organizationService: OrganizationService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._identityService = identityService;
        this._organizationService = organizationService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _identityService: IdentityService;
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
        direction: "descending"
    };

    /**
     * The roles to present in the table.
     */
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
     * Called by the framework when the `sorting` property changes.
     */
    public sortingChanged(): void
    {
        this.fetch();
    }

    /**
     * Fetches the latest data.
     */
    protected fetch(): void
    {
        const organizationId = this._identityService.organization!.id;

        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._roles = await this._organizationService.getRoles(organizationId, signal);

            // tslint:disable-next-line: no-floating-promises
            this._historyHelper.navigate((state: IHistoryState) =>
            {
                state.params.sortProperty = this.sorting?.property || undefined;
                state.params.sortDirection = this.sorting?.direction || undefined;
                state.params.text = this.textFilter || undefined;
            },
            { trigger: false, replace: true });
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
        const organizationId = this._identityService.organization!.id;
        const newRole = await this._modalService.open(EditRolePanel, { organizationId }).promise;

        if (newRole != null)
        {
            this._roles!.push(newRole);
        }
    }

    /**
     * Called when the `Edit` icon is clicked on a role.
     * Opens a modal for editing the role.
     * @param role The role to edit.
     */
    protected async onEditRoleClick(role: OrganizationRole): Promise<void>
    {
        const organizationId = this._identityService.organization!.id;
        const newRole = await this._modalService.open(EditRolePanel, { organizationId, role }).promise;

        if (newRole != null)
        {
            this._roles!.splice(this._roles!.indexOf(role), 1, newRole);
        }
    }

    /**
     * Called when the `Dublicate` icon is clicked on a role.
     * Dublicates the role.
     * @param role The role to dublicate.
     */
    protected async onDuplicateRoleClick(role: OrganizationRole): Promise<void>
    {
        const organizationId = this._identityService.organization!.id;

        try
        {
            const newRole = await this._organizationService.duplicateRole(organizationId, role.id);

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
        // TODO: Ask for confirmation.

        const organizationId = this._identityService.organization!.id;

        try
        {
            await this._organizationService.deleteRole(organizationId, role.id);

            this._roles!.splice(this._roles!.indexOf(role), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the role", error);
        }
    }
}
