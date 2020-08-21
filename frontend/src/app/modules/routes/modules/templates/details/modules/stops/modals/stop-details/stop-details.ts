import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { RouteTemplateStop, RouteTemplateService, RouteTemplate } from "app/model/route-template";
import { RouteStopType } from "app/model/route";
import { Log } from "shared/infrastructure";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class TemplateStopDetailsPanel
{
    /**
     * Creates a new instance of the type.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param addressService The `AddressService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        addressService: AddressService,
        modal: Modal)
    {
        this._routeTemplateService = routeTemplateService;
        this._addressService = addressService;
        this._modal = modal;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _addressService: AddressService;
    private readonly _modal: Modal;
    private _result: RouteTemplateStop | undefined;

    /**
     * The template.
     */
    protected template: RouteTemplate;

    /**
     * The model for the modal.
     */
    protected model: RouteTemplateStop;

    /**
     * The available types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => new RouteStopType(slug as any));

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { template: RouteTemplate, stop?: RouteTemplateStop}): void
    {
        this.model = model.stop?.clone() ?? new RouteTemplateStop();
        this.template = model.template;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteTemplateStop | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        try {
            console.log(this.model);

            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            // Mark the modal as busy.
            this._modal.busy = true;

            // Resolve stop location, if needed.
            if (this.model.location.address.id != null)
            {
                try
                {
                    this.model.location = await this._addressService.getLocation(this.model.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            if (this.model.id) {
                await this._routeTemplateService.updateStop(this.template, this.model);
            } else {
                await this._routeTemplateService.addStop(this.template, this.model);
            }

            this._result = this.model;
            await this._modal.close();
        } catch (error) {
            Log.error("An error occurred while adding the stop.\n", error);
        } finally {
            this._modal.busy = false;
        }
    }
}
