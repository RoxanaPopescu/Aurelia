import { autoinject, bindable } from "aurelia-framework";
import { RouteTemplate, RouteTemplateStop, RouteTemplateService } from "app/model/route-template";
import { ModalService, ToastService, IValidation } from "shared/framework";
import { TemplateStopDetailsPanel } from "./modals/stop-details/stop-details";
import { Log } from "shared/infrastructure";

/**
 * Represents the page.
 */
@autoinject
export class Stops
{
    /**
     * Creates a new instance of the class.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param modalService The `ModalService` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(
        routeTemplateService: RouteTemplateService,
        modalService: ModalService,
        toastService: ToastService
    )
    {
        this._routeTemplateService = routeTemplateService;
        this._modalService = modalService;
        this._toastService = toastService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _modalService: ModalService;
    private _isMovingStop = false;
    private _targetIndex: number | undefined;

    /**
     * The `ToastService` instance.
     */
    protected readonly _toastService: ToastService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The data table element.
     */
    protected dataTableElement: HTMLElement;

    /**
     * The template to present.
     */
    @bindable
    protected template: RouteTemplate;

    /**
     * True if the number of stops is less than two,
     * or undefined if not yet validated.
     */
    protected hasInvalidStopCount: boolean;

    /**
     * True if the first stop is not a pickup stop,
     * or undefined if not yet validated.
     */
    protected hasInvalidFirstStop: boolean;

    /**
     * True if the last stop is a pickup stop,
     * or undefined if not yet validated.
     */
    protected hasInvalidLastStop: boolean;

    /**
     * True if any stop other than the last is a return stop,
     * or undefined if not yet validated.
     */
    protected hasInvalidReturnStop: boolean;

    /**
     * Called when the "Add stop" button is clicked.
     * Opens at modal for creating a new stop.
     */
    protected async onAddStopClick(index?: number): Promise<void>
    {
        let stopNumber: number;

        if (index != null)
        {
            // Index exist, 1-index it since it's stopNumber
            stopNumber = index + 1;
        }
        else
        {
            // End of list, since it's a stopNumber we add one to the list length
            stopNumber = this.template.stops.length + 1;
        }

        const newStop = new RouteTemplateStop(undefined, stopNumber);
        const savedStop = await this._modalService.open(TemplateStopDetailsPanel, { template: this.template, stop: newStop }).promise;

        if (savedStop != null)
        {
            if (index != null)
            {
                this.template.stops.splice(index, 0, savedStop);
            }
            else
            {
                this.template.stops.push(savedStop);
            }
        }
    }

    /**
     * Called when the "Edit stop" icon is clicked on a stop.
     * Opens at modal for editing the stop.
     * @param stop The stop to edit.
     */
    protected async onEditStopClick(stop: RouteTemplateStop): Promise<void>
    {
        const newStop = await this._modalService.open(TemplateStopDetailsPanel, { template: this.template, stop: stop }).promise;

        if (newStop != null)
        {
            this.template.stops.splice(this.template.stops.indexOf(stop), 1, newStop);

            if (this.validation.active)
            {
                this.validate().catch();
            }
        }
    }

    /**
     * Called when a stop is moved to a new position in the list.
     * @param source The stop being moved.
     * @param target The stop currently occupying the target position.
     */
    protected onMoveStop(source: RouteTemplateStop, target: RouteTemplateStop): void
    {
        const sourceIndex = this.template.stops.indexOf(source);
        this._targetIndex = this.template.stops.indexOf(target);
        this.template.stops.splice(this._targetIndex, 0, ...this.template.stops.splice(sourceIndex, 1));

        if (!this._isMovingStop)
        {
            this._isMovingStop = true;

            document.addEventListener("mouseup", async () =>
            {
                if (this._targetIndex != null && this._targetIndex !== source.stopNumber - 1)
                {
                    try
                    {
                        await this._routeTemplateService.moveStop(this.template, source, this._targetIndex);
                    }
                    catch (error)
                    {
                        Log.error("Could not move template stop", error);
                    }
                    finally
                    {
                        this._isMovingStop = false;
                        this._targetIndex = undefined;
                    }
                }
            }, { once: true });
        }
    }

    /**
     * Called when the "Remove stop" icon is clicked on a stop.
     * Removes the stop from the template.
     * @param index The index of the stop to remove.
     */
    protected async onRemoveStopClick(index: number): Promise<void>
    {
        try
        {
            const stop = this.template.stops[index];
            await this._routeTemplateService.deleteStop(stop.id);

            this.template.stops.splice(index, 1);
        }
        catch (error)
        {
            Log.error("Could not delete the stop", error);
        }
    }

    /**
     * Validates the page.
     * @returns A promise that will be resolved with true if validation succeeded, otherwise false.
     */
    private async validate(): Promise<boolean | undefined>
    {
        this.hasInvalidStopCount = this.template.stops.length < 2;

        const firstStop = this.template.stops[0];
        this.hasInvalidFirstStop = firstStop != null && firstStop.type.slug !== "pickup";

        const lastStop = this.template.stops[this.template.stops.length - 1];
        this.hasInvalidLastStop = lastStop != null && lastStop.type.slug === "pickup";

        const returnStopIndex = this.template.stops != null ? this.template.stops.findIndex(s => s.type.slug === "return") : -1;
        this.hasInvalidReturnStop = returnStopIndex >= 0 && returnStopIndex !== this.template.stops.length - 1;

        // Validate the form.
        return this.validation.validate();
    }
}
