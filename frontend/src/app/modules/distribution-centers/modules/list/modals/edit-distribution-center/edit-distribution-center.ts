import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Operation } from "shared/utilities";
import { Modal, IValidation } from "shared/framework";
import { Location } from "app/model/shared";
import { DistributionCenterService, DistributionCenter } from "app/model/distribution-center";
import { AddressService } from "app/components/address-input/services/address-service/address-service";

@autoinject
export class EditDistributionCenterPanel
{
    /**
     * Creates a new instance of the type.
     * @param distributionCenterService The `DistributionCenterService` instance.
     * @param addressService The `AddressService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(distributionCenterService: DistributionCenterService, addressService: AddressService, modal: Modal)
    {
        this._distributionCenterService = distributionCenterService;
        this._addressService = addressService;
        this._modal = modal;
    }

    private readonly _distributionCenterService: DistributionCenterService;
    private readonly _addressService: AddressService;
    private readonly _modal: Modal;
    private _result: DistributionCenter | undefined;

    /**
     * The name of the distribution center, before editing.
     */
    protected distributionCenterName: string | undefined;

    /**
     * The distribution center for the modal.
     */
    protected distributionCenter: DistributionCenter;

    /**
     * The distribution centers, used to verify uniqueness of the distribution center name.
     */
    protected distributionCenters: DistributionCenter[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public async activate(model: { distributionCenter?: DistributionCenter; distributionCenters?: DistributionCenter[] }): Promise<void>
    {
        if (model.distributionCenter != null)
        {
            // tslint:disable-next-line: no-unused-expression
            new Operation(async signal =>
            {
                try
                {
                    this._modal.busy = true;

                    this.distributionCenter = await this._distributionCenterService.get(model.distributionCenter!.id, signal);

                    this._modal.busy = false;
                }
                catch (error)
                {
                    Log.error("Could not get the distribution center.", error);
                }
            });
        }
        else
        {
            this.distributionCenter = new DistributionCenter();
            this.distributionCenter.location = new Location();
        }

        this.distributionCenterName = model.distributionCenter?.name;
        this.distributionCenters = model.distributionCenters ?? [] as any;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited distribution center, or undefined if cancelled.
     */
    public async deactivate(): Promise<DistributionCenter | undefined>
    {
        return this._result;
    }

    /**
     * Called when the `Create distribution center` or `Save changes` button is clicked.
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

            // HACK: We don't get the ID and provider from the backend, so if they are set, it means the user changed the address.
            if (this.distributionCenter.location.address.id != null && this.distributionCenter.location.address.provider != null)
            {
                this.distributionCenter.location = await this._addressService.getLocation(this.distributionCenter.location.address);
            }

            if (this.distributionCenter.id)
            {
                this._result = await this._distributionCenterService.update(this.distributionCenter);
            }
            else
            {
                this._result = await this._distributionCenterService.create(this.distributionCenter);
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while saving the distribution center.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
