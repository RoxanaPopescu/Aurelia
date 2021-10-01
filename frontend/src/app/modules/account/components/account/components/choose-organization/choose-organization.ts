import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationInfo, OrganizationUserInvite } from "app/model/organization";

export interface IChooseOrganizationModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "choose-organization";

    /**
     * The ID of the invite to present, if any.
     */
    inviteId: string | undefined;

    /**
     * The function to call when the operation completes.
     */
    onChooseOrganization?: () => unknown | Promise<unknown>;

    /**
     * The function to call when the view is changed.
     */
    onViewChanged?: () => unknown;

    /**
     * True if the operation is pending, otherwise false.
     */
    busy?: boolean;

    /**
     * True if the operation was completed, otherwise false.
     */
    done?: boolean;
}

@autoinject
export class ChooseOrganizationCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService)
    {
        this._identityService = identityService;
        this._organizationService = organizationService;
    }

    private readonly _identityService: IdentityService;
    private readonly _organizationService: OrganizationService;

    /**
     * The model representing the state of the component.
     */
    @bindable
    protected model: IChooseOrganizationModel;

    /**
     * The organizations associated with the user.
     */
    protected organizations: OrganizationInfo[];

    /**
     * The pending invite, if an invite ID was specified.
     */
    protected invite: OrganizationUserInvite | undefined;

    /**
     * Called by the framework when the component is binding.
     * Resets the `done` state of the component.
     */
    public async bind(): Promise<void>
    {
        this.model.done = false;

        try
        {
            this.model.busy = true;

            const promises: Promise<any>[] =
            [
                this._organizationService.getAll()
                    .then(list => this.organizations = list)
                    .catch(error =>
                    {
                        Log.error("Could not get the organizations associated with the user.", error);

                        throw error;
                    })
            ];

            if (this.model.inviteId != null)
            {
                promises.push(this._organizationService.getInvite(this.model.inviteId)
                    .then(invite => this.invite = invite)
                    .catch(error =>
                    {
                        if (error.response?.sattus === 404)
                        {
                            Log.error("Could not find the specified invite");
                        }
                        else if (error.response?.sattus === 403)
                        {
                            Log.error("The specified invite does not match the email you signed in with");
                        }
                        else
                        {
                            Log.error("Could not get the invite.", error);
                        }

                        throw error;
                    }));
            }

            await Promise.all(promises);
        }
        finally
        {
            this.model.busy = false;
        }
    }

    /**
     * Called when the `Create organization` button is pressed.
     */
    protected onCreateOrganizationClick(): void
    {
        this.model.view = "create-organization" as any;
        this.model.onViewChanged?.();
    }

    /**
     * Called when an organization is clicked.
     * Authorizes the user to access the organization.
     * @param organizationId The ID of the organization that was clicked.
     */
    protected async onOrganizationClick(organizationId: string): Promise<void>
    {
        try
        {
            this.model.busy = true;

            // NOTE:
            // The organization is created asynchronously, so failed API requests are to be expected.
            // However, due to the retry logic, authorization should eventually succeed.
            await this._identityService.authorize(organizationId, true);

            // tslint:disable-next-line: await-promise
            await this.model.onChooseOrganization?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("An error occurred while signing in to the organization.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }

    /**
     * Called when an invite is clicked.
     * Accepts the invite and authorizes the user to access the organization.
     * @param invite The invite that was clicked.
     */
    protected async onInviteClick(invite: OrganizationUserInvite): Promise<void>
    {
        this.model.busy = true;

        try
        {
            try
            {
                await this._organizationService.acceptInvite(invite.id);
            }
            catch (error)
            {
                Log.error("An error occurred while accepting the invite.", error);

                return;
            }

            try
            {
                // NOTE:
                // The invite is created asynchronously, so failed API requests are to be expected.
                // However, due to the retry logic, authorization should eventually succeed.
                await this._identityService.authorize(invite.organization.id, true);
            }
            catch (error)
            {
                Log.error("An error occurred while signing in to the organization.", error);

                return;
            }

            // tslint:disable-next-line: await-promise
            await this.model.onChooseOrganization?.();

            this.model.done = true;
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
