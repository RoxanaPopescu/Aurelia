import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationInfo } from "app/model/organization";

export interface IChooseOrganizationModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "choose-organization";

    /**
     * The function to call when the operation completes.
     */
    onSignedIn?: () => unknown | Promise<unknown>;

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
     * Called by the framework when the component is binding.
     * Resets the `done` state of the component.
     */
    public async bind(): Promise<void>
    {
        this.model.done = false;

        try
        {
            this.model.busy = true;

            this.organizations = await this._organizationService.getAll();
        }
        catch (error)
        {
            Log.error("Could not get the organizations associated with the user.", error);
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
     * Called when an organization is pressed.
     * Signs the user in to the organization.
     * @param organization The organization to sign into.
     */
    protected async onOrganizationClick(organization: any): Promise<void>
    {
        try
        {
            this.model.busy = true;

            await this._identityService.authorize(organization);

            // tslint:disable-next-line: await-promise
            await this.model.onSignedIn?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("Sign in failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
