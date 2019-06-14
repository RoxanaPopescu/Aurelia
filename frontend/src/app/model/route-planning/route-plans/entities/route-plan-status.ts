import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `RoutePlanStatus`.
 */
export type RoutePlanStatusSlug = keyof typeof RoutePlanStatus.values;

/**
 * Represents the status of a route.
 */
export class RoutePlanStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route plan.
     */
    public constructor(slug: RoutePlanStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, RoutePlanStatus.values[slug] || { name: slug, accent: "neutral" });
    }

    public slug: RoutePlanStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly values =
    {
        "Processing":
        {
            name: "Processing",
            accent: "neutral"
        },
        "WaitingForApproval":
        {
            name: "Waiting for approval",
            accent: "attention"
        },
        "Completed":
        {
            name: "Completed",
            accent: "positive"
        },
        "FailedExternally":
        {
            name: "Failed externally",
            accent: "negative"
        },
        "FailedInternally":
        {
            name: "Failed internally",
            accent: "negative"
        },
        "Cancelled":
        {
            name: "Cancelled",
            accent: "neutral"
        }
    };
}
