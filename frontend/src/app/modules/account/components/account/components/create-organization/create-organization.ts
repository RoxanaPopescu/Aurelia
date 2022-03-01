import { autoinject, bindable } from "aurelia-framework";
import { Cookies, Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { OrganizationService } from "app/model/organization";
import { delay } from "shared/utilities";

export interface ICreateOrganizationModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "create-organization";

    /**
     * The name of the organization.
     */
    organizationName?: string;

    /**
     * The id of the organization.
     */
    organizationId?: string;

    /**
     * The function to call when the operation completes.
     */
    onOrganizationCreated?: () => unknown | Promise<unknown>;

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
export class CreateOrganizationCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param cookies The `Cookies` instance.
     */
    public constructor(organizationService: OrganizationService, cookies: Cookies)
    {
        this._organizationService = organizationService;

        // Used for migration since we need to create some orgs. with a custom GUID
        this.showId = (cookies?.get("poweruser") == 'true') ?? false;
    }

    private readonly _organizationService: OrganizationService;

    /**
     * The model representing the state of the component.
     */
    @bindable
    protected model: ICreateOrganizationModel;

    /**
     * The validation for the component.
     */
    protected validation: IValidation;

    /**
     * Show organization id - this is used for migration
     */
    protected showId: boolean;

    /**
     * Called by the framework when the component is binding.
     * Resets the `done` state of the component.
     */
    public bind(): void
    {
        this.model.busy = false;
        this.model.done = false;
    }

    /**
     * Called when a key is pressed.
     * Submits the form if the `Enter` key is pressed.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented || event.altKey || event.metaKey || event.shiftKey || event.ctrlKey)
        {
            return true;
        }

        if (event.key === "Enter")
        {
            // tslint:disable-next-line: no-floating-promises
            this.onCreateOrganizationClick();

            return false;
        }

        return true;
    }

    /**
     * Called when the `Create organization` button is pressed.
     * Submits the form.
     */
    protected async onCreateOrganizationClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            this.model.busy = true;

            await this._organizationService.create(
            {
                type: "business",
                name: this.model.organizationName!,
                id: this.model.organizationId
            });

            // HACK: The organization and its roles are created asynchronously,
            // and there is no way to determine when it is done - so we wait.
            await delay(5000);

            // tslint:disable-next-line: await-promise
            await this.model.onOrganizationCreated?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("An error occurred while creating the organization.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
