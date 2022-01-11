import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { AutomaticDispatchSettings, AutomaticDispatchSettingsService } from "app/model/automatic-dispatch";
import { OrganizationService } from "app/model/organization";
import { IdentityService } from "app/services/identity";
import { Consignor } from "app/model/outfit";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the automatic dispatch rule set, or undefined if new.
     */
    id?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class AutomaticDispatchSettingsDetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param automaticDispatchSettingsService The `AutomaticDispatchSettingsService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(automaticDispatchSettingsService: AutomaticDispatchSettingsService, organizationService: OrganizationService, identityService: IdentityService)
    {
        this._automaticDispatchSettingsService = automaticDispatchSettingsService;
        this._organizationService = organizationService;
        this._identityService = identityService;
    }

    private readonly _automaticDispatchSettingsService: AutomaticDispatchSettingsService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;

    private availableConsignors: Consignor[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The automatic dispatch rule set.
     */
    protected settings: AutomaticDispatchSettings;

    /**
     * True if the automatic dispatch rule set is new, otherwise false.
     */
    protected isNew: boolean;

    /**
     * True if the page is busy, otherwise false.
     */
    protected busy: boolean = false;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        this.isNew = params.id == null;

        if (!this.isNew)
        {
            this.settings = await this._automaticDispatchSettingsService.get(params.id!);

            addToRecentEntities(this.settings.toEntityInfo());
        }
        else
        {
            this.settings = new AutomaticDispatchSettings();
        }

        // Execute tasks that should not block rendering.

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const connections = await this._organizationService.getConnections();
            this.availableConsignors = connections.map(c => new Consignor({ id: c.organization.id, companyName: c.organization.name }));
            this.availableConsignors.push(this._identityService.identity!.organization!);
        })();
    }

    /**
     * Called when the "Save changes" or "Create rule set" button is clicked.
     * Saves the automatic dispatch settings.
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

        this.busy = true;

        try
        {
            if (this.isNew)
            {
                await this._automaticDispatchSettingsService.create(this.settings);

                this.isNew = false;
            }
            else
            {
                await this._automaticDispatchSettingsService.update(this.settings);
            }
        }
        catch (error)
        {
            Log.error("Could not save the rule set", error);
        }
        finally
        {
            this.busy = false;
        }
    }

    /**
     * Called when the pause button is clicked.
     * Pauses the rule set.
     */
    protected async onPauseClick(): Promise<void>
    {
        this.busy = true;

        try
        {
            await this._automaticDispatchSettingsService.pause(this.settings.id);

            this.settings.paused = true;
        }
        catch (error)
        {
            Log.error("Could not pause the rule set", error);
        }
        finally
        {
            this.busy = false;
        }
    }

    /**
     * Called when the unpause button is clicked.
     * Unpauses the rule set.
     */
    protected async onUnpauseClick(): Promise<void>
    {
        this.busy = true;

        try
        {
            await this._automaticDispatchSettingsService.unpause(this.settings.id);

            this.settings.paused = false;
        }
        catch (error)
        {
            Log.error("Could not unpause the rule set", error);
        }
        finally
        {
            this.busy = false;
        }
    }
}
