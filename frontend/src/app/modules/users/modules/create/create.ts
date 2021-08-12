import { autoinject, computedFrom } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Operation } from "shared/utilities";
import { HistoryHelper, Log } from "shared/infrastructure";
import { Outfit } from "app/model/outfit";
import { UserInvite, UserService } from "app/model/user";
import { RoleInfo, RoleService } from "app/model/role";
import { DepartmentService } from "app/model/department";
import { IdentityService } from "app/services/identity";

/**
 * Represents the module.
 */
@autoinject
export class CreateModule
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param userService The `UserService` instance.
     * @param roleService The `RoleService` instance.
     * @param departmentService The `DepartmentService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(
        identityService: IdentityService,
        userService: UserService,
        roleService: RoleService,
        departmentService: DepartmentService,
        historyHelper: HistoryHelper)
    {
        this._userService = userService;
        this._roleService = roleService;
        this._departmentService = departmentService;
        this._historyHelper = historyHelper;
        this.outfit = identityService.identity!.outfit!;
    }

    private readonly _userService: UserService;
    private readonly _roleService: RoleService;
    private readonly _departmentService: DepartmentService;
    private readonly _historyHelper: HistoryHelper;
    protected _departments: Outfit[];

    /**
     * The outfit to which the current identity belongs.
     */
    protected outfit: Outfit;

    /**
     * The available roles.
     */
    protected roles: RoleInfo[];

    /**
     * The user invite to send.
     */
    protected userInvite: UserInvite;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The selected role.
     */
    @computedFrom("userInvite.roleId", "roles")
    protected get selectedRole(): RoleInfo | undefined
    {
        return this.userInvite?.roleId == null ? undefined : this.roles.find(r => r.id === this.userInvite.roleId);
    }

    /**
     * The selected department.
     */
    @computedFrom("userInvite.outfitId", "outfit", "departments")
    protected get selectedDepartment(): Outfit | undefined
    {
        return this.userInvite?.outfitId == null ? undefined : this.departments.find(d => d.id === this.userInvite.outfitId);
    }

    /**
     * The available departments within the outfit.
     */
    @computedFrom("outfit", "_departments")
    protected get departments(): Outfit[]
    {
        return [this.outfit, ...(this._departments || [])];
    }

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        this.operation = new Operation(async signal =>
        {
            [this.roles, this._departments] = await Promise.all(
            [
                this._roleService.getAll(),
                (await this._departmentService.getAll()).departments
            ]);

            this.userInvite = {} as any;
        });
    }

    /**
     * Called when the "Send invite" button is clicked.
     */
    protected async onSendInviteClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        // Send the invite.
        this.operation = new Operation(async signal =>
        {
            await this._userService.invite(this.userInvite);

            await this._historyHelper.navigate("/users");
        });

        this.operation.promise.catch(error =>
            Log.error("Could not send the invite", error));
    }
}
