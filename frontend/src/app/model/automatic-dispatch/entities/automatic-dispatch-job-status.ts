import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import statusNames from "../resources/strings/route-plan-status-names.json";

/**
 * Represents the slug identifying a `RoutePlanStatus`.
 */
export type AutomaticDispatchJobStatusSlug = keyof typeof AutomaticDispatchJobStatus.values;

/**
 * Represents the status of a route.
 */
export class AutomaticDispatchJobStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route plan.
     */
    public constructor(slug: AutomaticDispatchJobStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, AutomaticDispatchJobStatus.values[this.slug] || { name: slug, accent: "neutral" });
    }

    public slug: AutomaticDispatchJobStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.slug;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "processing":
        {
            name: statusNames.processing,
            accent: "neutral"
        },
        "approved":
        {
            name: statusNames.approved,
            accent: "positive"
        },
        "failed":
        {
            name: statusNames.failed,
            accent: "negative"
        },
        "cancelled":
        {
            name: statusNames.cancelled,
            accent: "neutral"
        },
        "succeeded":
        {
            name: statusNames.succeeded,
            accent: "neutral"
        }
    };
}
