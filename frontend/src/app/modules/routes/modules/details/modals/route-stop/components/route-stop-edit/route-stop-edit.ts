import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus, RouteStopType, RouteService } from "app/model/route";
import { Duration, DateTime } from "luxon";
import { observable } from "aurelia-binding";
import { DateTimeRange } from "shared/types";
import { ColloScanMethod, ColloStatus } from "app/model/collo";

@autoinject
export class RouteStopEditCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     */
     public constructor(routeService: RouteService)
     {
         this._routeService = routeService;
     }

     private readonly _routeService: RouteService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * If the service on the stop is being started.
     */
    protected startingService = false;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStopStatus.values).map(slug => new RouteStopStatus(slug as any));

    /**
     * The colli statuses.
     */
    protected colliStatuses = Object.keys(ColloStatus.values).map(slug => new ColloStatus(slug as any));

    /**
     * The colli statuses.
     */
    protected colliScanMethods = Object.keys(ColloScanMethod.values).map(slug => new ColloScanMethod(slug as any));

    /**
     * The available stop types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => new RouteStopType(slug as any));

    /**
     * The model for the modal.
     */
    @bindable
    public model: { route: Route; routeStop: RouteStop; isNew: boolean };

    /**
     * Called when the `Save` button is pressed.
     */
    @bindable
    public onSave: () => void;

    /**
     * Called when the `Cancel` button is pressed.
     */
    @bindable
    public onCancel: () => void;

    /**
     * The local date element for stop arrival date
     */
    @observable
    public date: DateTime | undefined;

    /**
     * The local time element for stop arrival time from
     */
    @observable
    public timeFrom: Duration | undefined;

    /**
     * The local time element for stop arrival time to
     */
    @observable
    public timeTo: Duration | undefined;

    /**
     * Called by the framework when the component is detached.
     * Detaches the item from the item picker.
     */
    public attached(): void
    {
        if (this.model.routeStop.arrivalTimeFrame != null)
        {
            this.date = this.model.routeStop.arrivalTimeFrame.from?.startOf("day");
            this.timeFrom = this.model.routeStop.arrivalTimeFrame.from?.diff(this.model.routeStop.arrivalTimeFrame.from?.startOf("day"));
            this.timeTo = this.model.routeStop.arrivalTimeFrame.to?.diff(this.model.routeStop.arrivalTimeFrame.to?.startOf("day"));

        }
        else
        {
            const firstStop = this.model.route.stops.find(s => s instanceof RouteStop && s.status.slug !== "cancelled") as RouteStop;

            if (firstStop != null)
            {
                this.date = firstStop.arrivalTimeFrame.from?.startOf("day");
            }
        }
    }

    /**
     * True if the stop has a service task, otherwise false.
     */
    @computedFrom("model.routeStop.tags")
    protected get hasServiceTask(): boolean
    {
        return this.model.routeStop.tags?.some(t => t.toLowerCase() === "service");
    }

    /**
     * Called when the status is changed.
     * If we are completing a stop we default the colli statues dependent on the stop type.
     */
    protected setColliStatus(status: RouteStopStatus, type: RouteStopType): void
    {
        if (status.slug !== "completed")
        {
            this.model.routeStop.allColliStatus = undefined;
            this.model.routeStop.allColliScanMethod = undefined;

            return;
        }

        this.model.routeStop.allColliStatus = new ColloStatus(type.slug === "pickup" ? "picked-up" : "delivered");
        this.model.routeStop.allColliScanMethod = new ColloScanMethod("manually");
    }

    /**
     * Called when the observable property, date, changes value.
     */
    protected dateChanged(newValue: DateTime | undefined): void
    {
        if (newValue != null)
        {
            if (this.model.routeStop.arrivalTimeFrame == null)
            {
                this.model.routeStop.arrivalTimeFrame = new DateTimeRange(
                {
                    from: newValue,
                    to: newValue
                });
            }
            else
            {
                if (this.model.routeStop.arrivalTimeFrame.from != null)
                {
                    this.model.routeStop.arrivalTimeFrame.from = this.model.routeStop.arrivalTimeFrame.from.set({
                        day: newValue.day,
                        month: newValue.month,
                        year: newValue.year
                    });
                }
                else
                {
                    this.model.routeStop.arrivalTimeFrame.from = newValue;
                }

                if (this.model.routeStop.arrivalTimeFrame.to != null)
                {
                    this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to.set({
                        day: newValue.day,
                        month: newValue.month,
                        year: newValue.year
                    });
                }
                else
                {
                    this.model.routeStop.arrivalTimeFrame.to = newValue;
                }

                this.dateTimeChanged();
            }
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected timeFromChanged(newValue: Duration | undefined): void
    {
        if (newValue != null)
        {
            this.model.routeStop.arrivalTimeFrame.from = this.model.routeStop.arrivalTimeFrame.from?.startOf("day").plus(newValue);

            this.dateTimeChanged();
        }
    }

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected timeToChanged(newValue: Duration | undefined): void
    {
        if (newValue != null)
        {
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.from?.startOf("day").plus(newValue);

            this.dateTimeChanged();
        }
    }

    /**
     * Called when the timeFrom, timeTo or date changes value.
     */
    protected dateTimeChanged(): void
    {
        if (this.model.routeStop.arrivalTimeFrame.to == null || this.model.routeStop.arrivalTimeFrame.from == null)
        {
            return;
        }

        if (this.model.routeStop.arrivalTimeFrame.to.diff(this.model.routeStop.arrivalTimeFrame.from).as("seconds") < 0)
        {
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to.plus({ day: 1 });
        }
        else if (this.model.routeStop.arrivalTimeFrame.to.minus({ day: 1 }).diff(this.model.routeStop.arrivalTimeFrame.from).as("seconds") > 0)
        {
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to.minus({ day: 1 });
        }
    }

    /**
     * Called when the service should start.
     */
    protected async onStartServiceClick(): Promise<void>
    {
        this.startingService = true;

        try
        {
            await this._routeService.startServiceTask(this.model.routeStop);
            this.model.routeStop.serviceTaskStarted = DateTime.now();
        }
        finally
        {
             this.startingService = false;
        }
    }

    /**
     * Called when the arrived date changes.
     * Updated the task time started if it's not already set.
     */
    protected onArrivedTimeChanged(date: DateTime): void
    {
        if (this.model.routeStop.taskTimeStarted != null || date == null)
        {
            return;
        }

        this.model.routeStop.taskTimeStarted = date;
    }
}
