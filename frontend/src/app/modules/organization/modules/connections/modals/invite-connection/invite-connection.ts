import { autoinject, observable } from "aurelia-framework";
import { ApiError, Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationService, OrganizationConnection, OrganizationInfo } from "app/model/organization";
import { Operation } from "shared/utilities";

@autoinject
export class InviteConnectionPanel
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(organizationService: OrganizationService, modal: Modal)
    {
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _organizationService: OrganizationService;
    private readonly _modal: Modal;
    private _result: OrganizationConnection | undefined;

    /**
     * The latest fetch operation, if any.
     */
    protected fetchOperation: Operation | undefined;

    /**
     * The ID of the organization to connect to, or undefined if not yet specified.
     */
    @observable
    protected organizationId: string | undefined;

    /**
     * The organization to connect to, null if not found, or undefined if not yet fetched.
     */
    protected organization: OrganizationInfo | null | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The invited connection, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationConnection | undefined>
    {
        return this._result;
    }

    /**
     * Called when the `Send invite` button is clicked.
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

            this._result = await this._organizationService.inviteConnection(this.organizationId!);

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while inviting the organization to connect.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }

    protected organizationIdChanged(): void
    {
        this.fetchOperation?.abort();
        this.organization = undefined;

        if (this.organizationId?.length === 36)
        {
            this.fetchOperation = new Operation(async signal =>
            {
                try
                {
                    this.organization = await this._organizationService.get(this.organizationId!, signal);
                }
                catch (error)
                {
                    if (error instanceof ApiError && error.response?.status === 404)
                    {
                        this.organization = null;
                    }
                }
            });
        }
    }
}
