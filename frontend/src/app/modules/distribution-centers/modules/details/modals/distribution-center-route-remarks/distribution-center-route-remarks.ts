import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework/services/modal";
import { Log } from "shared/infrastructure";
import { DistributionCenterRoute, DistributionCenterRouteRemark, DistributionCenterService } from "app/model/distribution-center";

@autoinject
export class DistributionCenterRouteRemarksDialog
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param distributionCenterService The `DistributionCenterService` instance.
     */
    public constructor(modal: Modal, distributionCenterService: DistributionCenterService)
    {
        this._modal = modal;
        this._distributionCenterService = distributionCenterService;
    }

    private readonly _distributionCenterService: DistributionCenterService;
    private readonly _modal: Modal;

    /**
     * The model for the modal.
     */
    protected model: { distributionCenterId: string; route: DistributionCenterRoute };

    /**
     * The remarks associated with the route.
     */
    protected remarkInfos: { remark: DistributionCenterRouteRemark; selected: boolean }[];

    /**
     * The note associated with the remarks, if any.
     */
    protected note: string | undefined;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { distributionCenterId: string; route: DistributionCenterRoute }): void
    {
        this.model = model;

        const availableRemarks = Object.keys(DistributionCenterRouteRemark.values).map(code => new DistributionCenterRouteRemark(code));

        this.remarkInfos = availableRemarks.map(remark => ({ remark, selected: model.route.remarks.some(r => r.code === remark.code) }));
        this.note = model.route.note;
    }

    /**
     * Called by the framework when the modal is deactivated.
     */
    public async deactivate(): Promise<void>
    {
        await this.saveChanges();
    }

    /**
     * Saves the changes, if any.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async saveChanges(): Promise<void>
    {
        const remarks = this.remarkInfos.filter(r => r.selected).map(r => r.remark);

        // If no changes were made, do nothing.
        if (this.note === this.model.route.note &&
            remarks.map(r => r.code).sort().join(",") === this.model.route.remarks.map(r => r.code).sort().join(","))
        {
            return;
        }

        try
        {
            this._modal.busy = true;

            await this._distributionCenterService.saveRouteRemarks(
                this.model.distributionCenterId,
                this.model.route.id,
                this.model.route.driverId,
                remarks,
                this.note);

            this.model.route.remarks = remarks;
            this.model.route.note = this.note;

            await this._modal.close(this.note);
        }
        catch (error)
        {
            Log.error("Could not save the route problems", error);

            throw error;
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
