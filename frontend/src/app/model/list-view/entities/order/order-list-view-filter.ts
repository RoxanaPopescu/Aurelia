import { DateTime, Duration } from "luxon";
import { Container, observable } from "aurelia-framework";
import { OrderStatus, OrderStatusSlug } from "../../../order";
import { ListViewFilter } from "../list-view-filter";
import { TemplateStringParser } from "shared/infrastructure";

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
    public orderTagsFilter: any[] | undefined;

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
     * Called from the `ListView` instance when the criteria should be updated.
     */
    public updateCriteria(): void
    {
        // tslint:disable: no-invalid-template-strings

        const parser = Container.instance.get(TemplateStringParser);

        const overrideContext =
        {
            fromDateOffset: this.relativeFromDateFilter?.as(this.relativeFromDateFilterUnit!),
            absFromDateOffset: this.relativeFromDateFilter != null ? Math.abs(this.relativeFromDateFilter.as(this.relativeFromDateFilterUnit!)) : undefined,
            toDateOffset: this.relativeToDateFilter?.as(this.relativeToDateFilterUnit!),
            absToDateOffset: this.relativeToDateFilter != null ? Math.abs(this.relativeToDateFilter.as(this.relativeToDateFilterUnit!)) : undefined
        };

        this.criteria =
        [
            // Status filter
            {
                slug: "status",
                name: "Status",
                description: "When this filter is applied, you will only see orders whose status matches one of the specified values",
                model:
                {
                    statusFilter: this.statusFilter
                },
                clear: () =>
                {
                    this.statusFilter = undefined;
                },
                summary: this.statusFilter?.map(s => OrderStatus.values[s].name)
            },

            // Tags filter
            {
                slug: "tags",
                name: "Tags",
                description: "When this filter is applied, you will only see orders that have all the specified tags",
                model:
                {
                    orderTagsFilter: this.orderTagsFilter
                },
                clear: () =>
                {
                    this.orderTagsFilter = undefined;
                },
                summary: this.orderTagsFilter
            },

            // Date range filter
            {
                slug: "date-range",
                name: "Date range",
                description: "When this filter is applied, you will only see orders whose pickup date and time is within the specified range",
                model:
                {
                    fromDateFilter: this.fromDateFilter,
                    useRelativeFromDateFilter: this.useRelativeFromDateFilter,
                    relativeFromDateFilterUnit: this.relativeFromDateFilterUnit,
                    relativeFromDateFilter: this.relativeFromDateFilter,
                    toDateFilter: this.toDateFilter,
                    useRelativeToDateFilter: this.useRelativeToDateFilter,
                    relativeToDateFilterUnit: this.relativeToDateFilterUnit,
                    relativeToDateFilter: this.relativeToDateFilter
                },
                clear: () =>
                {
                    this.fromDateFilter = undefined;
                    this.useRelativeFromDateFilter = false;
                    this.relativeFromDateFilterUnit = "hours";
                    this.relativeFromDateFilter = undefined;
                    this.toDateFilter = undefined;
                    this.useRelativeToDateFilter = false;
                    this.relativeToDateFilterUnit = "hours";
                    this.relativeToDateFilter = undefined;
                },
                summary: this.fromDateFilter == null && this.toDateFilter == null ? undefined :
                [
                    this.fromDateFilter == null ? undefined :
                        this.useRelativeFromDateFilter
                            ? this.relativeFromDateFilterUnit === "days"
                                ? overrideContext.fromDateOffset === 0
                                    ? "From the beginning of today"
                                    : overrideContext.fromDateOffset! >= 0
                                        ? parser.parse("From the beginning of the day, \n${absFromDateOffset | number} ${absFromDateOffset | plural: 'day' : 'days'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("From the beginning of the day, \n${absFromDateOffset | number} ${absFromDateOffset | plural: 'day' : 'days'} in the past").evaluate(this, overrideContext)
                                : overrideContext.fromDateOffset! === 0
                                    ? "From now"
                                    : overrideContext.fromDateOffset! >= 0
                                        ? parser.parse("From ${absFromDateOffset | number} ${absFromDateOffset | plural: 'hour' : 'hours'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("From ${absFromDateOffset | number} ${absFromDateOffset | plural: 'hour' : 'hours'} in the past").evaluate(this, overrideContext)
                            : parser.parse("From the beginning of the day, \n${fromDateFilter | date}").evaluate(this, overrideContext),

                    this.toDateFilter == null ? undefined :
                        this.useRelativeToDateFilter
                            ? this.relativeToDateFilterUnit === "days"
                                ? overrideContext.toDateOffset === 0
                                    ? "To the end of today"
                                    : overrideContext.toDateOffset! >= 0
                                        ? parser.parse("To the end of the day, \n${absToDateOffset | number} ${absToDateOffset | plural: 'day' : 'days'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("To the end of the day, \n${absToDateOffset | number} ${absToDateOffset | plural: 'day' : 'days'} in the past").evaluate(this, overrideContext)
                                : overrideContext.toDateOffset! === 0
                                    ? "To now"
                                    : overrideContext.toDateOffset! >= 0
                                        ? parser.parse("To ${absToDateOffset | number} ${absToDateOffset | plural: 'hour' : 'hours'} in the future").evaluate(this, overrideContext)
                                        : parser.parse("To ${absToDateOffset | number} ${absToDateOffset | plural: 'hour' : 'hours'} in the past").evaluate(this, overrideContext)
                            : parser.parse("To the end of the day, \n${toDateFilter | date}").evaluate(this, overrideContext)
                ]
                .filter(s => s) as string[]
            }
        ];

        this.criteria.sort((a, b) => a.name.localeCompare(b.name));

        // tslint:enable
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

        this.update?.(newValue, oldValue, propertyName);
    }
}
