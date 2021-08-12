import { autoinject, computedFrom } from "aurelia-framework";
import { IValidation, ModalService } from "shared/framework";
import { Operation } from "shared/utilities";
import { HistoryHelper, Log } from "shared/infrastructure";
import { Outfit } from "app/model/outfit";
import { User, UserService } from "app/model/user";
import { RoleInfo, RoleService } from "app/model/role";
import { DepartmentService } from "app/model/department";
import { ConfirmDeactivateDialog } from "./modals/confirm-deactivate/confirm-deactivate";
import { ConfirmResetPasswordDialog } from "./modals/confirm-reset-password/confirm-reset-password";
import { IdentityService } from "app/services/identity";

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param userService The `UserService` instance.
     * @param roleService The `RoleService` instance.
     * @param departmentService The `DepartmentService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(
        identityService: IdentityService,
        userService: UserService,
        roleService: RoleService,
        departmentService: DepartmentService,
        historyHelper: HistoryHelper,
        modalService: ModalService)
    {
        this._userService = userService;
        this._roleService = roleService;
        this._departmentService = departmentService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this.outfit = identityService.identity!.outfit!;
    }

    private readonly _userService: UserService;
    private readonly _roleService: RoleService;
    private readonly _departmentService: DepartmentService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;
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
     * The user.
     */
    protected user: User;

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
    @computedFrom("user.role.id", "roles")
    protected get selectedRole(): RoleInfo | undefined
    {
        return this.user?.role.id == null ? undefined : this.roles.find(r => r.id === this.user.role.id);
    }

    /**
     * The selected department.
     */
    @computedFrom("user.outfitId", "outfit", "departments")
    protected get selectedDepartment(): Outfit | undefined
    {
        return this.user?.outfitId == null ? undefined : this.departments.find(d => d.id === this.user.outfitId);
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
    public activate(params: any): void
    {
        this.operation = new Operation(async signal =>
        {
            [this._departments, this.roles, this.user] = await Promise.all(
            [
                (await this._departmentService.getAll()).departments,
                await this._roleService.getAll(),
                await this._userService.get(params.id)
            ]);
        });

        this.operation.promise.catch(error =>
            Log.error("Could not load all data", error));
    }

    /**
     * Called when the "Save changes" button is clicked.
     */
    protected async onSaveClick(): Promise<void>
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
            await this._userService.setRole(this.user.id, this.user.role.id);

            await this._historyHelper.navigate("/users");
        });

        this.operation.promise.catch(error =>
            Log.error("Could not save the user", error));
    }

    /**
     * Called when the "Deactivate account" button is clicked.
     */
    protected async onDeactivateClick(): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeactivateDialog,
        {
            user: this.user

        }).promise;

        if (!confirmed)
        {
            return;
        }

        this.operation = new Operation(async signal =>
        {
            await this._userService.deactivate(this.user.username);

            this.user = await this._userService.get(this.user.id);
        });

        this.operation.promise.catch(error =>
            Log.error("Could not deactivate the user", error));
    }

    /**
     * Called when the "Deactivate account" button is clicked.
     */
     protected onRectivateClick(): void
     {
         this.operation = new Operation(async signal =>
         {
             await this._userService.reactivate(this.user.username);

             this.user = await this._userService.get(this.user.id);
         });

         this.operation.promise.catch(error =>
             Log.error("Could not reactivate the user", error));
     }

    /**
     * Called when the "Reset password" button is clicked.
     */
    protected async onResetPasswordClick(): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmResetPasswordDialog,
        {
            user: this.user

        }).promise;

        if (!confirmed)
        {
            return;
        }

        this.operation = new Operation(async signal =>
        {
            await this._userService.resetPassword(this.user.username);

            this.user = await this._userService.get(this.user.id);
        });

        this.operation.promise.catch(error =>
            Log.error("Could not request password reset", error));
    }
}
