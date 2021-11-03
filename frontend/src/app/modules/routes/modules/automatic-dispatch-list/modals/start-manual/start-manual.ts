import { autoinject } from "aurelia-framework";
import { AutomaticDispatchService, AutomaticDispatchStartManual } from "app/model/automatic-dispatch";
import { IValidation, Modal, ToastService } from "shared/framework";
import { OrganizationService } from "app/model/organization";
import { Outfit } from "app/model/outfit";
import { IdentityService } from "app/services/identity";
import { Log } from "shared/infrastructure";
import { VehicleService, VehicleType } from "app/model/vehicle";
import startedAutomaticDispatchToast from "./resources/strings/manual-started-automatic-dispatch-toast.json";

@autoinject
export class StartManualPanel
{
    /**
     * Creates a new instance of the class.
     * The `AutomaticDispatchService` instance.
     * @param automaticDispatchService The `AutomaticDispatchService` instance.
     * @param modal The `Modal` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param identityService The `IdentityService` instance.
     * @param vehicleService The `VehicleService` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(automaticDispatchService: AutomaticDispatchService, modal: Modal, organizationService: OrganizationService, identityService: IdentityService, vehicleService: VehicleService, toastService: ToastService)
    {
        this._automaticDispatchService = automaticDispatchService;
        this._organizationService = organizationService;
        this._identityService = identityService;
        this._toastService = toastService;
        this._modal = modal;
        this._vehicleService = vehicleService;
    }

    private readonly _automaticDispatchService: AutomaticDispatchService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;
    private readonly _vehicleService: VehicleService;
    private readonly _modal: Modal;
    protected readonly _toastService: ToastService;

    /**
     * The model to change.
     */
    protected model = new AutomaticDispatchStartManual();

    /**
     * The organizations to show in the filter.
     */
    protected organizations: Outfit[];

    /**
     * The available vehicle types.
     */
    protected vehicleTypes: VehicleType[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the module is activated.
     */
    public async activate(): Promise<void>
    {
        this.vehicleTypes = await this._vehicleService.getTypes();

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const connections = await this._organizationService.getConnections();
            this.organizations = connections.map(c => new Outfit({ id: c.organization.id, companyName: c.organization.name }));
            this.organizations.push(this._identityService.identity!.organization!);
        })();
    }

    /**
     * Called to link the creator id to customerName in the UI
     * @param params the id of the creator
     * @returns The outfit if found
     */
    protected getOrganizationFromId(id: string): Outfit | undefined
    {
        return this.organizations.find(c => c.id === id);
    }

    /**
     * Called to link the vehicle id to vehicle type in the UI
     * @param params the id of the vehicle type
     * @returns The vehicle type if found
     */
    protected getVehicleFromId(id: string): VehicleType | undefined
    {
        return this.vehicleTypes.find(c => c.id === id);
    }

    /**
     * Called when the automatic dispatch should start with the current filters
     */
    protected async onStartClick(): Promise<void>
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

            const id = await this._automaticDispatchService.startManual(this.model);

            const toastModel =
            {
                heading: startedAutomaticDispatchToast.heading,
                body: startedAutomaticDispatchToast.body,
                url: `/routes/automatic-dispatch/${id}`
            };

            this._toastService.open("success", toastModel);

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the order", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
