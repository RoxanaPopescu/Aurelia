import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationRole } from "app/model/organization";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { IPermission } from "./components/permissions/permissions";

@autoinject
export class EditRolePanel
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService, modal: Modal)
    {
        this._identityService = identityService;
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _identityService: IdentityService;
    private readonly _organizationService: OrganizationService;
    private readonly _modal: Modal;
    private _fetchOperation: Operation | undefined;
    private _result: OrganizationRole | undefined;

    /**
     * The name of the role, before editing.
     */
    protected roleName: string | undefined;

    /**
     * The role for the modal.
     */
    protected role: OrganizationRole;

    /**
     * The roles within the organization, used to verify uniqueness of the role name.
     */
    protected roles: OrganizationRole[];

    /**
     * The available permissions.
     */
    protected availablePermissions: IPermission[] | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { role?: OrganizationRole; roles?: OrganizationRole[] }): void
    {
        this.role = model.role?.clone() ?? new OrganizationRole();
        this.roleName = this.role.name;
        this.roles = model.roles ?? [];

        this._fetchOperation = new Operation(async () =>
        {
            try
            {
                this.availablePermissions = await this._organizationService.getPermissions();
            }
            catch (error)
            {
                Log.error("An error occurred while getting permissions.", error);
            }

            if (model.role != null)
            {
                addToRecentEntities(model.role.toEntityInfo());
            }
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited role, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationRole | undefined>
    {
        this._fetchOperation?.abort();

        return this._result;
    }

    /**
     * Called when the `Create role` or `Save changes` button is clicked.
     */
    protected async onSubmitClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this._modal.busy = true;

            if (this.role.id)
            {
                this._result = await this._organizationService.saveRole(this.role);

                if (this.role.id === this._identityService.identity!.role!.id)
                {
                    // Reauthenticate to ensure we get the updated permissions.
                    await this._identityService.reauthorize();
                }
            }
            else
            {
                this._result = await this._organizationService.createRole(this.role);
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while saving the role.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
