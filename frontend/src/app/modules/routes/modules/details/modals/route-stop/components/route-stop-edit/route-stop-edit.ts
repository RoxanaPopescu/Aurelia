import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus, RouteStopType } from "app/model/route";
import { Duration, DateTime } from "luxon";
import { observable } from "aurelia-binding";
import { DateTimeRange } from "shared/types";
import { ColloScanMethod, ColloStatus } from "app/model/collo";

@autoinject
export class RouteStopEditCustomElement
{
    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

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
            // New stop, default to last index
            if (this.model.route.stops[0] instanceof RouteStop)
            {
                this.date = this.model.route.stops[0].arrivalTimeFrame.from?.startOf("day");
            }
        }
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
                    from: newValue.setZone("UTC"),
                    to: newValue.setZone("UTC")
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
}
