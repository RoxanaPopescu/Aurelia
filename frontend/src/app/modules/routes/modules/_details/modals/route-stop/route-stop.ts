import { autoinject } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { Log } from "shared/infrastructure";
import { RouteStopType, RouteStop, RouteService, Route } from "app/model/route";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class RouteStopPanel
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param addressService The `AddressService` instance.
     */
    public constructor(routeService: RouteService, addressService: AddressService)
    {
        this._routeService = routeService;
        this._addressService = addressService;
    }

    private readonly _routeService: RouteService;
    private readonly _addressService: AddressService;
    private _result: RouteStop | undefined;

    /**
     * True if the model represents a new stop, otherwise false.
     */
    protected isNew: boolean;

    /**
     * True if the model is in edit mode, otherwise false.
     */
    protected edit = false;

    /**
     * The model for the modal.
     */
    protected model: { route: Route; routeStop: RouteStop; isNew: boolean };

    /**
     * The available types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => ({ slug, ...RouteStopType.values[slug] }));

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { route: Route; routeStop: RouteStop; edit: boolean }): void
    {
        this.isNew = (model.routeStop?.id) == null;
        this.edit = this.isNew || model.edit;
        this.model = { route: model.route, routeStop: model.routeStop?.clone(), isNew: this.isNew };
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteStop | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Edit" icon is clicked.
     * Transitions the modal to its edit mode.
     */
    protected onEditToggle(): void
    {
        this.edit = !this.edit;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and transitions the modal to its readonly mode.
     */
    protected async onSaveClick(atIndex?: number): Promise<void>
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

            if (this.model.routeStop.location.address.id != null && this.model.routeStop.location.position == null)
            {
                try
                {
                    // Resolve stop location.
                    this.model.routeStop.location = await this._addressService.getLocation(this.model.routeStop.location.address);
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);

                    return;
                }
            }

            if (this.isNew)
            {
                console.log(atIndex)
                await this._routeService.addRouteStop(this.model.route, this.model.routeStop, atIndex != null ? atIndex : this.model.routeStop.stopNumber - 1);
            }
            else
            {
                await this._routeService.saveRouteStop(this.model.route, this.model.routeStop);
            }

            this._result = this.model.routeStop;
            this.edit = false;
        }
        catch (error)
        {
            Log.error("Could not save the route stop", error);
        }
    }
}
