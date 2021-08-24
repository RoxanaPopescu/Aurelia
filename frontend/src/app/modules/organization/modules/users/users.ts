import { autoinject, computedFrom } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService, ToastService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationUser } from "app/model/organization";
import { InviteUserPanel } from "./modals/invite-user/invite-user";
import { ConfirmRemoveUserDialog } from "./modals/confirm-remove-user/confirm-remove-user";
import reinviteToastStrings from "./resources/strings/reinvite-toast.json";
import { UserModalPanel } from "./modals/user/user";

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
export class UsersPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, toastService: ToastService, identityService: IdentityService, organizationService: OrganizationService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._toastService = toastService;
        this._identityService = identityService;
        this._organizationService = organizationService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
    private readonly _identityService: IdentityService;
    private readonly _organizationService: OrganizationService;
    private readonly _historyHelper: HistoryHelper;
    private _users: OrganizationUser[] | undefined;

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
        direction: "descending"
    };

    /**
     * The users to present in the table.
     */
    @computedFrom("_users.length", "sorting", "textFilter")
    protected get orderedAndFilteredUsers(): OrganizationUser[] | undefined
    {
        if (this._users == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._users

            // Filtering
            .filter(user => !this.textFilter || user.searchModel.contains(this.textFilter))

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
        const organizationId = this._identityService.identity!.outfit!.id;

        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._users = await this._organizationService.getUsers(organizationId, signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the users within the organization", error);
            }
        });
    }

    /**
     * Called when a row in the user table is clicked.
     * Opens a modal presenting the public profile of the user.
     * @param user The user that was clicked.
     */
    protected async onUserClick(user: OrganizationUser): Promise<void>
    {
        await this._modalService.open(UserModalPanel, user).promise;
    }

    /**
     * Called when the `Invite user` button is clicked.
     * Opens a modal for inviting a user to join the organization.
     */
    protected async onInviteUserClick(): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;
        const newUser = await this._modalService.open(InviteUserPanel, { organizationId }).promise;

        if (newUser != null)
        {
            this._users!.push(newUser);
        }
    }

    /**
     * Called when the `Resend invite` icon is clicked on a user.
     * Resends the confirmation email.
     * @param user The user to reinvite.
     */
    protected async onResendInviteClick(user: OrganizationUser): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        try
        {
            await this._organizationService.resendInvite(organizationId, user.id);

            this._toastService.open("success",
            {
                heading: reinviteToastStrings.heading
            });
        }
        catch (error)
        {
            Log.error("Could not resend the invite", error);
        }
    }

    /**
     * Called when the `Remove` icon is clicked on a user.
     * Asks for confirmation, then removes the user.
     * @param user The user to remove.
     */
    protected async onRemoveUserClick(user: OrganizationUser): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmRemoveUserDialog, user).promise;

        if (!confirmed)
        {
            return;
        }

        const organizationId = this._identityService.identity!.outfit!.id;

        try
        {
            await this._organizationService.removeUser(organizationId, user.id);

            this._users!.splice(this._users!.indexOf(user), 1);
        }
        catch (error)
        {
            Log.error("Could not remove the user", error);
        }
    }
}
