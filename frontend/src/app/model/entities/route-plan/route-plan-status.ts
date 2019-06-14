import { Accent } from "app/model/entities/shared";

/**
 * Represents the slug identifying a `RoutePlanStatus`.
 */
export type RoutePlanStatusSlug = keyof typeof RoutePlanStatus.map;

/**
 * Represents the status of a route.
 */
export class RoutePlanStatus
{
    public constructor(slug: RoutePlanStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, RoutePlanStatus.map[slug] || { name: slug, accent: "neutral" });
    }

    public slug: RoutePlanStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly map =
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
