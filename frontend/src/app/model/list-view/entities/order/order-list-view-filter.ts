import { DateTime, Duration } from "luxon";
import { observable } from "aurelia-framework";
import { OrderStatusSlug } from "../../../order";
import { ListViewFilter } from "../list-view-filter";

/**
 * Represents a filter for a list view presenting items of type `OrderInfo`.
 */
export class OrderListViewFilter extends ListViewFilter
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        super();

        if (data != null)
        {
            this.textFilter = data.textFilter;
            this.statusFilter = data.statusFilter;
            this.orderTagsFilter = data.orderTagsFilter;
            this.fromDateFilter = data.fromDateFilter != null
                ? DateTime.fromISO(data.fromDateFilter, { setZone: true })
                : undefined;
            this.toDateFilter = data.toDateFilter != null
                ? DateTime.fromISO(data.toDateFilter, { setZone: true })
                : undefined;

            this.relativeFromDateFilterUnit = data.relativeFromDateFilterUnit || "hours";
            this.useRelativeFromDateFilter = data.relativeFromDateFilter != null;
            this.relativeFromDateFilter = data.relativeFromDateFilter
                ? Duration.fromISO(data.relativeFromDateFilter)
                : undefined;

            this.relativeToDateFilterUnit = data.relativeToDateFilterUnit || "hours";
            this.useRelativeToDateFilter = data.relativeToDateFilter != null;
            this.relativeToDateFilter = data.relativeToDateFilter
                ? Duration.fromISO(data.relativeToDateFilter)
                : undefined;
        }
    }

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    public textFilter: string | undefined;

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    public statusFilter: OrderStatusSlug[] | undefined;

    /**
     * The order tags for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    public orderTagsFilter: any[];

    /**
     * The min date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    public fromDateFilter: DateTime | undefined;

    /**
     * The max date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    public toDateFilter: DateTime | undefined;

    /**
     * True to use `relativeFromDateFilter`, otherwise false.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public useRelativeFromDateFilter = false;

    /**
     * The min relative time for which orders should be shown.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeFromDateFilter: Duration | undefined;

    /**
     * The unit in which `relativeFromDateFilter` is specified.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeFromDateFilterUnit: "days" | "hours" | undefined = "hours";

    /**
     * True to use `relativeToDateFilter`, otherwise false.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public useRelativeToDateFilter = false;

    /**
     * The max relative time for which orders should be shown.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeToDateFilter: Duration | undefined;

    /**
     * The unit in which `relativeToDateFilter` is specified.
     */
    @observable({ changeHandler: "updateRelativeStartTimeFilter" })
    public relativeToDateFilterUnit: "days" | "hours" | undefined = "hours";

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            textFilter: this.textFilter,
            statusFilter: this.statusFilter,
            orderTagsFilter: this.orderTagsFilter,
            fromDateFilter: this.useRelativeFromDateFilter
                ? undefined
                : this.fromDateFilter?.toISO(),
            toDateFilter: this.useRelativeToDateFilter
                ? undefined
                : this.toDateFilter?.toISO(),
            relativeFromDateFilter: this.relativeFromDateFilter?.toISO(),
            relativeToDateFilter: this.relativeToDateFilter?.toISO(),
            relativeFromDateFilterUnit: this.relativeFromDateFilterUnit,
            relativeToDateFilterUnit: this.relativeToDateFilterUnit
        };
    }

    /**
     * Updates the state of the relative start time filter.
     */
    protected updateRelativeStartTimeFilter(newValue: any, oldValue: any, propertyName: string): void
    {
        const now = DateTime.local();

        if (this.useRelativeFromDateFilter && propertyName !== "relativeFromDateFilterUnit")
        {
            const nowOrStartOfToday = this.relativeFromDateFilterUnit === "days" ? now.startOf("day") : now;

            this.fromDateFilter = this.relativeFromDateFilter != null ? nowOrStartOfToday.plus(this.relativeFromDateFilter) : undefined;
        }
        else if (this.relativeFromDateFilter != null)
        {
            this.relativeFromDateFilter = undefined;
            this.fromDateFilter = undefined;
        }

        if (this.useRelativeToDateFilter && propertyName !== "relativeToDateFilterUnit")
        {
            const nowOrEndOfToday = this.relativeToDateFilterUnit === "days" ? now.endOf("day") : now;

            this.toDateFilter = this.relativeToDateFilter != null ? nowOrEndOfToday.plus(this.relativeToDateFilter) : undefined;
        }
        else if (this.relativeToDateFilter != null)
        {
            this.relativeToDateFilter = undefined;
            this.toDateFilter = undefined;
        }
    }
}
