import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { AgreementService } from "app/model/agreement";
import { RouteTemplateService, RouteTemplate, RouteRecurrence, RouteStatus, RouteTemplateStop } from "app/model/route-template";
import { Consignor } from "app/model/outfit";
import { ConfirmDeleteTemplateDialog } from "./modals/confirm-delete-template/confirm-delete-template";
import { Log } from "shared/infrastructure";
import { AppRouter } from "aurelia-router";
import { ModalService, IValidation } from "shared/framework";
import { StopDetailsPanelCustomElement as StopDetailsPanel } from "./modals/stop-details/stop-details";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route template.
     */
    id?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param routeTemplateService The `RouteTemplateService` instance.
     * @param agreementService The `AgreementService` instance.
     * @param modalService The `ModalService` instance.
     * @param router The `AppRouter` instance.
     */
    public constructor(routeTemplateService: RouteTemplateService, agreementService: AgreementService, modalService: ModalService, router: AppRouter)
    {
        this._routeTemplateService = routeTemplateService;
        this._agreementService = agreementService;
        this._modalService = modalService;
        this._router = router;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _agreementService: AgreementService;
    private readonly _modalService: ModalService;
    private readonly _router: AppRouter;

    /**
     * The original reference for the template.
     */
    protected originalReference: string | undefined;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The template to present.
     */
    protected template: RouteTemplate;

    /**
     * The available consignors.
     */
    protected consignors: Consignor[];

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStatus.values).map(slug => ({ slug, ...RouteStatus.values[slug] }));

    /**
     * The route recurrence representing the "All days" options.
     */
    protected allDays = new RouteRecurrence();

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * True if the first stop is not a pickup stop,
     * or undefined if not yet validated.
     */
    protected hasInvalidFirstStop: boolean;

    /**
     * True if any stop other than the last is a return stop,
     * or undefined if not yet validated.
     */
    protected hasInvalidReturnStop: boolean;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        if (params.id)
        {
            // Create and execute the new operation.
            this.fetchOperation = new Operation(async signal =>
            {
                // Fetch the data.
                this.template = await this._routeTemplateService.get(params.id!, signal);
                this.originalReference = this.template.reference;

                this.updateAllDay();
            });
        }
        else
        {
            this.template = new RouteTemplate();
        }

        // Execute tasks that should not block rendering.

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const agreements = await this._agreementService.getAll();
            this.consignors = agreements.agreements.filter(c => c.type.slug === "consignor");

        })();
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }
    }

    /**
     * Called when the "Delete template" button is clicked.
     * Deletes the template.
     */
    protected async onDeleteClick(): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteTemplateDialog).promise)
        {
            return;
        }

        try
        {
            await this._routeTemplateService.delete(this.template.id);

            this._router.navigate("/routes/templates/list");
        }
        catch (error)
        {
            Log.error("Could not delete template", error);
        }

    }

    /**
     * Called when the "Save template" button is clicked.
     * Saves the template.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        this.hasInvalidFirstStop = this.template.stops[0] == null || this.template.stops[0].type.slug !== "pickup";

        const returnStopIndex = this.template.stops != null ? this.template.stops.findIndex(s => s.type.slug === "return") : -1;
        this.hasInvalidReturnStop = returnStopIndex >= 0 && returnStopIndex !== this.template.stops.length - 1;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            if (!this.template.id)
            {
                await this._routeTemplateService.create(this.template);
            }
            else
            {
                await this._routeTemplateService.save(this.template);
            }

            this._router.navigate("/routes/templates/list");
        }
        catch (error)
        {
            Log.error("Could not save template", error);
        }

    }

    /**
     * Called when the "Add stop" button is clicked.
     * Opens at modal for creating a new stop.
     */
    protected async onAddStopClick(): Promise<void>
    {
        const newStop = await this._modalService.open(StopDetailsPanel).promise;

        if (newStop != null)
        {
            this.template.stops.push(newStop);
        }
    }

    /**
     * Called when the "Edit stop" icon is clicked on a stop.
     * Opens at modal for editing the stop.
     * @param stop The stop to edit.
     */
    protected async onEditStopClick(stop: RouteTemplateStop): Promise<void>
    {
        const newStop = await this._modalService.open(StopDetailsPanel, stop).promise;

        if (newStop != null)
        {
            this.template.stops.splice(this.template.stops.indexOf(stop), 1, newStop);
        }
    }

    /**
     * Called when the "Move up" icon is clicked on a stop.
     * Moves the stop up.
     * @param index The index of teh stop to move.
     */
    protected onMoveStopUpClick(index: number): void
    {
        const stop = this.template.stops[index];
        this.template.stops.splice(index, 1);
        this.template.stops.splice(index - 1, 0, stop);
    }

    /**
     * Called when the "Move down" icon is clicked on a stop.
     * Moves the stop down.
     * @param index The index of teh stop to move.
     */
    protected onMoveStopDownClick(index: number): void
    {
        const stop = this.template.stops[index];
        this.template.stops.splice(index, 1);
        this.template.stops.splice(index + 1, 0, stop);
    }

    /**
     * Called when the "Remove stop" icon is clicked on a stop.
     * Removes the stop from teh template.
     * @param index The index of teh stop to remove.
     */
    protected onRemoveStopClick(index: number): void
    {
        this.template.stops.splice(index, 1);
    }

    /**
     * Called when a change is made to the recurrence settings for "All days".
     * Ensures driver and status are not both selected, and sets the weekday settings for each weekday.
     * @param property The property that changed.
     */
    protected onAllDaysRecurrenceChanged(property: "enabled" | "driver" | "status"): void
    {
        let setDriverAndStatus = false;

        switch (property)
        {
            case "enabled":
            {
                for (const recurrence of this.template.recurrence)
                {
                    recurrence.enabled = this.allDays.enabled;
                }

                break;
            }

            case "driver":
            {
                if (this.allDays.driver != null)
                {
                    this.allDays.status = undefined;
                    setDriverAndStatus = true;
                }

                break;
            }

            case "status":
            {
                if (this.allDays.status != null)
                {
                    this.allDays.driver = undefined;
                    setDriverAndStatus = true;
                }

                break;
            }
        }

        if (setDriverAndStatus)
        {
            for (const recurrence of this.template.recurrence)
            {
                recurrence.driver = this.allDays.driver;
                recurrence.status = this.allDays.status;
            }
        }
    }

    /**
     * Called when a change is made to the recurrence settings for a specific weekday.
     * Ensures driver and status are not both selected, and triggers an update of the "All days" settings.
     * @param property The property that changed.
     */
    protected onWeekdayRecurrenceChanged(recurrence: RouteRecurrence, property: "enabled" | "driver" | "status"): void
    {
        switch (property)
        {
            case "driver":
            {
                recurrence.status = undefined;

                break;
            }

            case "status":
            {
                recurrence.driver = undefined;

                break;
            }
        }

        this.updateAllDay();
    }

    /**
     * Sets the recurrence settings for "All days", based on the settings for the weekdays.
     */
    private updateAllDay(): void
    {
        this.allDays.enabled = this.template.recurrence.every(r => r.enabled);

        const driverIds = new Set(this.template.recurrence.map(r => r.driver && r.driver.id));
        this.allDays.driver = driverIds.size === 1 ? this.template.recurrence[0].driver : undefined;

        const statusSlugs = new Set(this.template.recurrence.map(r => r.status && r.status.slug));
        this.allDays.status = statusSlugs.size === 1 ? this.template.recurrence[0].status : undefined;
    }
}
