import { autoinject } from "aurelia-framework";
import { AutomaticDispatchService, AutomaticDispatchStartManual } from "app/model/automatic-dispatch";
import { IValidation, Modal } from "shared/framework";
import { OrganizationService } from "app/model/organization";
import { Outfit } from "app/model/outfit";
import { IdentityService } from "app/services/identity";

@autoinject
export class StartManualPanel
{
    /**
     * Creates a new instance of the class.
     * @param automaticDispatchService The `AutomaticDispatchService` instance.
     * @param modal The `Modal` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(automaticDispatchService: AutomaticDispatchService, modal: Modal, organizationService: OrganizationService, identityService: IdentityService)
    {
        this._automaticDispatchService = automaticDispatchService;
        this._organizationService = organizationService;
        this._identityService = identityService;
        this._modal = modal;
    }

    /**
     * Called by the framework when the module is activated.
     */
     public activate(): void
     {
         // tslint:disable-next-line: no-floating-promises
         (async () =>
         {
             const connections = await this._organizationService.getConnections();
             this.organizations = connections.map(c => new Outfit({ id: c.organization.id, companyName: c.organization.name }));
             this.organizations.push(this._identityService.identity!.organization!);
         })();
     }

    private readonly _automaticDispatchService: AutomaticDispatchService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;
    private readonly _modal: Modal;

    /**
     * The model to change.
     */
    protected model = new AutomaticDispatchStartManual();

    /**
     * The organizations to show in the filter.
     */
    protected organizations: Outfit[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called when the automatic dispatch should start with the current filters
     */
    protected async onStartClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        // Mark the modal as busy.
        this._modal.busy = true;

        // FIXME: Do correct call!
        this._automaticDispatchService.startManual(this.model);

        await this._modal.close();
    }
}
