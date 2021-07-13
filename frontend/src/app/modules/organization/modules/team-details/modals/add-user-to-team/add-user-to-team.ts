import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationService, OrganizationUser } from "app/model/organization";

@autoinject
export class AddUserToTeamPanel
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
    private _result: OrganizationUser | undefined;

    /**
     * The ID of the organization owning the team.
     */
    protected organizationId: string;

    /**
     * The ID of the team.
     */
    protected teamId: string;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { organizationId: string; teamId: string }): void
    {
        this.organizationId = model.organizationId;
        this.teamId = model.teamId;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationUser | undefined>
    {
        return this._result;
    }

    /**
     * Called when the `Create team` or `Save changes` button is clicked.
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

            // TODO
            const user = new OrganizationUser({});

            this._organizationService.addUserToTeam(this.organizationId, this.teamId, user.id);

            this._result = user;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while adding the user.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
