import { autoinject, bindable, bindingMode, observable, computedFrom } from "aurelia-framework";
import { DateTime, Zone, Duration } from "luxon";
import { EnterKeyHint } from "../input";

/**
 * Custom element representing an input for picking a date and time.
 */
@autoinject
export class DateTimeInputCustomElement
{
    private _nowIntervalHandle: any;
    private _now: DateTime;

    /**
     * True if the value property is being updated due to an internal change, otherwise false.
     */
    private isInternalUpdate = false;

    /**
     * The date value.
     */
    @observable
    protected dateValue: DateTime | null | undefined;

    /**
     * The time value.
     */
    @observable
    protected timeValue: Duration | null | undefined;

    /**
     * The computed min time.
     */
    @computedFrom("min", "minTime", "dateValue", "zone", "_now")
    protected get computedMinTime(): Duration | undefined
    {
        let minTime: Duration | undefined;

        if (typeof this.minTime === "string")
        {
            if (this.minTime.startsWith("P"))
            {
                minTime = Duration.fromISO(this.minTime);
            }
            else
            {
                const [hours, minutes] = this.minTime.split(":").map(s => parseInt(s));
                minTime = Duration.fromObject({ hours, minutes });
            }
        }
        else
        {
            minTime = this.minTime;
        }

        if (this.min === "now")
        {
            if (this.dateValue?.hasSame(this._now, "day"))
            {
                const timeNow = this._now.diff(this._now.startOf("day"));

                if (minTime == null || timeNow.valueOf() > minTime.valueOf())
                {
                    minTime = timeNow;
                }
            }
        }

        return minTime;
    }

    /**
     * The computed max time.
     */
    @computedFrom("max", "maxTime", "dateValue", "zone", "_now")
    protected get computedMaxTime(): Duration | undefined
    {
        let maxTime: Duration | undefined;

        if (typeof this.maxTime === "string")
        {
            if (this.maxTime.startsWith("P"))
            {
                maxTime = Duration.fromISO(this.maxTime);
            }
            else
            {
                const [hours, minutes] = this.maxTime.split(":").map(s => parseInt(s));
                maxTime = Duration.fromObject({ hours, minutes });
            }
        }
        else
        {
            maxTime = this.maxTime;
        }

        if (this.max === "now")
        {
            if (this.dateValue?.hasSame(this._now, "day"))
            {
                const timeNow = this._now.diff(this._now.startOf("day"));

                if (maxTime == null || timeNow.valueOf() < maxTime.valueOf())
                {
                    maxTime = timeNow;
                }
            }
        }

        return maxTime;
    }

    /**
     * The IANA Time Zone Identifier to use, `system` to use the system zone, or `utc` to use the UTC zone.
     */
    @bindable({ defaultValue: "system" })
    public zone: string | Zone;

    /**
     * The date picked by the user, null if the entered value could not be parsed,
     * or undefined if no date has been entered or picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: DateTime | null | undefined;

    /**
     * The date that is focused, but not yet picked, null if the entered value
     * could not be parsed, or undefined if no date has been entered or focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: DateTime | null | undefined;

    /**
     * The earliest date and time that can be selected, or undefined to disable this constraint.
     * This may be an ISO 8601 string, the string `now` or `today`, or a `DateTime` instance.
     */
    @bindable({ defaultValue: undefined })
    public min: string | DateTime | "now" | "today" | undefined;

    /**
     * The latest date and time that can be selected, or undefined to disable this constraint.
     * This may be an ISO 8601 string, the string `now` or `today`, or a `DateTime` instance.
     */
    @bindable({ defaultValue: undefined })
    public max: string | DateTime | "now" | "today" | undefined;

    /**
     * The earliest time that can be selected on any given day, or undefined to disable this constraint.
     * This may be an ISO 8601 string or a `Duration` instance.
     */
    @bindable({ defaultValue: undefined })
    public minTime: string | Duration | undefined;

    /**
     * The latest date that can be selected on any given day, or undefined to disable this constraint.
     * This may be an ISO 8601 string or a `Duration` instance.
     */
    @bindable({ defaultValue: undefined })
    public maxTime: string | Duration | undefined;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.fromView })
    public open: boolean;

    /**
     * True if the input is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * True to use `fixed` positioning for the dropdown, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ defaultValue: false })
    public fixed: boolean;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        this._now = DateTime.local().setZone(this.zone);
        this.valueChanged(this.value, undefined);
        this.scheduleNowRefresh();
    }

    /**
     * Called by the framework when the component is unbinding.
     */
    public unbind(): void
    {
        // Stop refreshing the `now` value.
        clearInterval(this._nowIntervalHandle);
    }

    /**
     * Called by the framework when the `value` property changes.
     * @param newValue The new value.
     * @param oldValue The old value.
     */
    protected valueChanged(newValue: DateTime | null | undefined, oldValue: DateTime | null | undefined): void
    {
        if (!this.isInternalUpdate)
        {
            if (newValue != null)
            {
                this.dateValue = newValue.startOf("day");
                this.timeValue = newValue.diff(this.dateValue);
            }
            else
            {
                this.dateValue = newValue;
                this.timeValue = newValue;
            }
        }

        this.isInternalUpdate = false;
    }

    /**
     * Called when the user changes the date.
     * @param newValue The new date value.
     */
    protected onDateValueChange(newValue: DateTime): void
    {
        this.isInternalUpdate = true;
        this.dateValue = newValue;

        const isToday = newValue?.hasSame(DateTime.local().setZone(this.zone), "day");
        const timeValue = this.timeValue?.valueOf();
        const minTime = this.computedMinTime?.valueOf();
        const maxTime = this.computedMaxTime?.valueOf();

        if (isToday && timeValue != null && ((minTime != null && timeValue < minTime) || (maxTime != null && timeValue > maxTime)))
        {
            this.timeValue = undefined;
        }

        if (newValue != null && this.timeValue != null)
        {
            this.value = newValue.plus(this.timeValue);
        }
        else if (this.value !== undefined)
        {
            this.value = undefined;
        }
        else
        {
            this.isInternalUpdate = false;
        }
    }

    /**
     * Called when the user changes the time.
     * @param newValue The new time value.
     */
    protected onTimeValueChange(newValue: Duration): void
    {
        this.isInternalUpdate = true;
        this.timeValue = newValue;

        if (this.dateValue != null && newValue != null)
        {
            this.value = this.dateValue.plus(newValue);
        }
        else if (this.value !== undefined)
        {
            this.value = undefined;
        }
    }

    /**
     * Schedules updates of the `now` value.
     */
    private scheduleNowRefresh(): void
    {
        this._nowIntervalHandle = setInterval(() =>
        {
            this._now = DateTime.local().setZone(this.zone);
        }, 1000);
    }
}
