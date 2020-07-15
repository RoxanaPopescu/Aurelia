import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus } from "app/model/route";
import { RouteStopType } from "../../../../../../../../model/route/entities/route-stop-type";
import { Duration, DateTime } from "luxon";
import { observable } from "aurelia-binding";
import { DateTimeRange } from "shared/types";

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
     * The local date element for stop driver arrived date
     */
    @observable({ changeHandler: "arrivedDateTimeChanged" })
    public arrivedDate: DateTime | undefined;

    /**
     * The local time element for stop driver arrived time
     */
    @observable({ changeHandler: "arrivedDateTimeChanged" })
    public arrivedTime: Duration | undefined;

    /**
     * The local date element for stop driver completed date
     */
    @observable({ changeHandler: "completedDateTimeChanged" })
    public completedDate: DateTime | undefined;

    /**
     * The local time element for stop driver completed time
     */
    @observable({ changeHandler: "completedDateTimeChanged" })
    public completedTime: Duration | undefined;

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

        if (this.model.routeStop.arrivedTime != null)
        {
            const arrivedDateTime = this.model.routeStop.arrivedTime.plus({ seconds: 0 });
            const date = arrivedDateTime.startOf("day");
            this.arrivedDate = date;
            this.arrivedTime = arrivedDateTime.diff(date);
        }

        if (this.model.routeStop.completedTime != null)
        {
            const completedDateTime = this.model.routeStop.completedTime.plus({ seconds: 0 });
            const date = completedDateTime.startOf("day");
            this.completedDate = date;
            this.completedTime = completedDateTime.diff(date);
        }
    }

    /**
     * Called when the completedDate or completedTime changes value.
     */
    protected completedDateTimeChanged(): void
    {
        if (this.completedDate == null || this.completedTime == null)
        {
            this.model.routeStop.completedTime = undefined;
            return;
        }

        const date = this.completedDate.toUTC();
        this.model.routeStop.completedTime = date.startOf("day").plus(this.completedTime);
    }

    /**
     * Called when the arrivedTime or arrivedDate changes value.
     */
    protected arrivedDateTimeChanged(): void
    {
        if (this.arrivedDate == null || this.arrivedTime == null)
        {
            this.model.routeStop.arrivedTime = undefined;
            return;
        }

        const date = this.arrivedDate.toUTC();
        this.model.routeStop.arrivedTime = date.startOf("day").plus(this.arrivedTime);
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

        if (this.model.routeStop.arrivalTimeFrame.to!.diff(this.model.routeStop.arrivalTimeFrame.from!).as("seconds") < 0)
        {
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to!.plus({ day: 1 });
        }
        else if (this.model.routeStop.arrivalTimeFrame.to!.minus({ day: 1 }).diff(this.model.routeStop.arrivalTimeFrame.from!).as("seconds") > 0)
        {
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to!.minus({ day: 1 });
        }
    }
}
