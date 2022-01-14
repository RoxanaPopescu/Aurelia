import { autoinject } from "aurelia-framework";
import { HistoryHelper, Log } from "shared/infrastructure";
import { IValidation, ModalService } from "shared/framework";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";
import { IdentityService } from "app/services/identity";
import { OrganizationService } from "app/model/organization";
import { Consignor, Fulfiller } from "app/model/outfit";
import { VehicleType } from "app/model/vehicle";
import { AutomaticDispatchSettings, AutomaticDispatchSettingsService } from "app/model/automatic-dispatch";
import { RunAutomaticDispatchSettingsDialog } from "./modals/confirm-run/confirm-run";
import routeTitles from "../../resources/strings/route-titles.json";

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
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(
        automaticDispatchSettingsService: AutomaticDispatchSettingsService,
        organizationService: OrganizationService,
        identityService: IdentityService,
        historyHelper: HistoryHelper,
        modalService: ModalService)
    {
        this._automaticDispatchSettingsService = automaticDispatchSettingsService;
        this._organizationService = organizationService;
        this._identityService = identityService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
    }

    private readonly _automaticDispatchSettingsService: AutomaticDispatchSettingsService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;

    /**
     * The creators connected to the current organization.
     */
    protected availableCreators: Consignor[];

    /**
     * The available vehicle types.
     */
    protected availableVehicleTypes: VehicleType[];

    /**
     * The contractors connected to the current organization.
     */
    protected availableContractors: Fulfiller[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The automatic dispatch rule set.
     */
    protected settings: AutomaticDispatchSettings;

    /**
     * The current name of the dispatch rule set.
     */
    protected ruleSetName: string;

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
            this.ruleSetName = this.settings.name;

            addToRecentEntities(this.settings.toEntityInfo());
        }
        else
        {
            this.settings = new AutomaticDispatchSettings();
            this.ruleSetName = routeTitles.newAutomaticDispatchSettings;
        }

        setTimeout(() => this._historyHelper.setTitle(`${this.ruleSetName}${this._historyHelper.titleSeparator}${document.title}`));

        // Execute tasks that should not block rendering.

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            this.availableVehicleTypes = VehicleType.getAll();

            const connections = await this._organizationService.getConnections();

            this.availableCreators = connections.map(c => new Consignor({ id: c.organization.id, companyName: c.organization.name }));
            this.availableCreators.push(this._identityService.identity!.organization!);

            this.availableContractors = connections.map(c => new Fulfiller({ id: c.organization.id, companyName: c.organization.name }));
            this.availableContractors.push(this._identityService.identity!.organization!);
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
                this.settings = await this._automaticDispatchSettingsService.create(this.settings);
            }
            else
            {
                this.settings = await this._automaticDispatchSettingsService.update(this.settings);
            }
        }
        catch (error)
        {
            Log.error("Could not save the rule set", error);

            this.busy = false;

            return;
        }

        this._historyHelper.setTitle(`${this.settings.name}${document.title.substring(this.ruleSetName.length)}`);
        this.ruleSetName = this.settings.name;
        this.isNew = false;

        await this._historyHelper.navigate(state =>
        {
            state.path = state.path.replace(/create$/, `details/${this.settings.id}`);
        },
        { trigger: false, replace: true });

        this.busy = false;
    }

    /**
     * Called when the `Pause` button is clicked.
     * Pauses the rule set.
     */
    protected async onPauseClick(): Promise<void>
    {
        this.busy = true;

        try
        {
            this.settings = await this._automaticDispatchSettingsService.pause(this.settings.id);
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
     * Called when the `Unpause` button is clicked.
     * Unpauses the rule set.
     */
    protected async onUnpauseClick(): Promise<void>
    {
        this.busy = true;

        try
        {
            this.settings = await this._automaticDispatchSettingsService.unpause(this.settings.id);
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

    /**
     * Called when the `Run now` button is clicked.
     * Schedules the rule set to run immediately.
     */
    protected async onRunNowClick(): Promise<void>
    {
        const confirmed = await this._modalService.open(RunAutomaticDispatchSettingsDialog, this.settings).promise;

        if (!confirmed)
        {
            return;
        }

        this.busy = true;

        try
        {
            await this._automaticDispatchSettingsService.runNow(this.settings.id);
        }
        catch (error)
        {
            Log.error("Could not run the rule set", error);
        }
        finally
        {
            this.busy = false;
        }
    }
}
