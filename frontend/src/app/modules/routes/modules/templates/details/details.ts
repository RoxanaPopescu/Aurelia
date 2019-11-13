import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { AgreementService } from "app/model/agreement";
import { RouteTemplateService, RouteTemplate, RouteRecurrence, RouteStatus } from "app/model/route-template";
import { Consignor } from "app/model/outfit";

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
     */
    public constructor(routeTemplateService: RouteTemplateService, agreementService: AgreementService)
    {
        this._routeTemplateService = routeTemplateService;
        this._agreementService = agreementService;
    }

    private readonly _routeTemplateService: RouteTemplateService;
    private readonly _agreementService: AgreementService;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The template to present.
     */
    protected template: Partial<RouteTemplate>;

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
                for (const recurrence of this.template.recurrence!)
                {
                    recurrence.enabled = this.allDays.enabled;
                }

                break;
            }

            case "driver":
            {
                this.allDays.status = undefined;
                setDriverAndStatus = true;

                break;
            }

            case "status":
            {
                this.allDays.driver = undefined;
                setDriverAndStatus = true;

                break;
            }
        }

        if (setDriverAndStatus)
        {
            for (const recurrence of this.template.recurrence!)
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
    protected updateAllDay(): void
    {
        this.allDays.enabled = this.template.recurrence!.every(r => r.enabled);

        const driverIds = new Set(this.template.recurrence!.map(r => r.driver && r.driver.id));
        this.allDays.driver = driverIds.size === 1 ? this.template.recurrence![0].driver : undefined;

        const statusSlugs = new Set(this.template.recurrence!.map(r => r.status && r.status.slug));
        this.allDays.status = statusSlugs.size === 1 ? this.template.recurrence![0].status : undefined;
    }
}
