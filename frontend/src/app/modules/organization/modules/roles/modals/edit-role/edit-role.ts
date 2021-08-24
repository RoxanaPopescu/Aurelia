import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationService, OrganizationRole } from "app/model/organization";
import { Operation } from "shared/utilities";
import { IPermission } from "./components/permissions/permissions";

@autoinject
export class EditRolePanel
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param modalService The `ModalService` instance.
     * @param driverService The `DriverService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(organizationService: OrganizationService, modal: Modal)
    {
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _organizationService: OrganizationService;
    private readonly _modal: Modal;
    private _fetchOperation: Operation | undefined;
    private _result: OrganizationRole | undefined;

    /**
     * The ID of the organization owning the role.
     */
    protected organizationId: string;

    /**
     * The role for the modal.
     */
    protected role: OrganizationRole;

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
    public activate(model: { organizationId: string; role?: OrganizationRole }): void
    {
        this.organizationId = model.organizationId;
        this.role = model.role?.clone() ?? new OrganizationRole();

        this._fetchOperation = new Operation(async () =>
        {
            this._modal.busy = true;

            try
            {
                this.availablePermissions = await this._organizationService.getPermissions(this.organizationId);

                this._modal.busy = false;
            }
            catch (error)
            {
                Log.error("An error occurred while getting permissions.", error);
            }
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
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
                this._result = await this._organizationService.updateRole(this.organizationId, this.role);
            }
            else
            {
                this._result = await this._organizationService.createRole(this.organizationId, this.role);
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
