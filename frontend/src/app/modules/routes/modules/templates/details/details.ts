import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { AgreementService } from "app/model/agreement";
import { RouteTemplateService, RouteTemplate } from "app/model/route-template";
import { Consignor } from "app/model/outfit";
import { RouteRecurrence } from "app/model/route-template/entities/route-recurrence";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
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
     * The consignors to show in the filter.
     */
    protected consignors: Consignor[];

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

    protected onAllDaysRecurrenceChanged(property: "enabled" | "driver" | "status"): void
    {
        let setDriverAndStatus = false;

        if (property === "enabled")
        {
            for (const recurrence of this.template.recurrence!)
            {
                recurrence.enabled = this.allDays.enabled;
            }
        }
        else if (property === "driver")
        {
            this.allDays.status = undefined;
            setDriverAndStatus = true;
        }
        else if (property === "status")
        {
            this.allDays.driver = undefined;
            setDriverAndStatus = true;
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

    protected onSingleDayRecurrenceChanged(recurrence: RouteRecurrence, property: "enabled" | "driver" | "status"): void
    {
        if (property === "enabled")
        {
            if (!recurrence.enabled)
            {
                // recurrence.driver = undefined;
                // recurrence.status = undefined;
            }
        }
        else if (property === "driver")
        {
            recurrence.status = undefined;
        }
        else if (property === "status")
        {
            recurrence.driver = undefined;
        }

        this.updateAllDay();
    }

    protected updateAllDay(): void
    {
        this.allDays.enabled = this.template.recurrence!.every(r => r.enabled);

        const driverIds = new Set(this.template.recurrence!.map(r => r.driver && r.driver.id));
        this.allDays.driver = driverIds.size === 1 ? this.template.recurrence![0].driver : undefined;

        const statusSlugs = new Set(this.template.recurrence!.map(r => r.status && r.status.slug));
        this.allDays.status = statusSlugs.size === 1 ? this.template.recurrence![0].status : undefined;
    }
}
