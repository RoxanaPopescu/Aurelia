import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus } from "app/model/route";
import { RouteStopType } from "../../../../../../../../model/route/entities/route-stop-type";
import { Duration, DateTime } from "luxon";
import { observable } from 'aurelia-binding';

@autoinject
export class RouteStopEditCustomElement
{
    /**
     * The model for the modal.
     */
    @bindable
    protected model: { route: Route; routeStop: RouteStop; isNew: boolean };

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStopStatus.values).map(slug => ({ slug, ...RouteStopStatus.values[slug] }));

    /**
     * The available stop types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => ({ slug, ...RouteStopType.values[slug] }));

    /**
     * Called when the `Save` button is pressed.
     */
    @bindable
    public onSave: (atIndex?: number) => void;

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
    }

    /**
     * Called when the observable property, date, changes value.
     */
    protected dateChanged(newValue: DateTime | undefined): void
    {
        if (newValue != null)
        {
            this.model.routeStop.arrivalTimeFrame.from = this.model.routeStop.arrivalTimeFrame.from?.set({
                                                                            day: newValue.day,
                                                                            month: newValue.month,
                                                                            year: newValue.year });
            this.model.routeStop.arrivalTimeFrame.to = this.model.routeStop.arrivalTimeFrame.to?.set({
                                                                            day: newValue.day,
                                                                            month: newValue.month,
                                                                            year: newValue.year });

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

    /**
     * Called when the observable property, timeFrom, changes value.
     */
    protected timeFromChanged(newValue: Duration | undefined): void
    {
        if (newValue != null)
        {
            this.model.routeStop.arrivalTimeFrame.from = this.model.routeStop.arrivalTimeFrame.from?.startOf("day").plus(newValue);
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
}
