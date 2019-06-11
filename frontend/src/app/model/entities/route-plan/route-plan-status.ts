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
        "Completed":
        {
            name: "Completed",
            accent: "positive"
        },
        "WaitingForApproval":
        {
            name: "Waiting for approval",
            accent: "neutral"
        },
        "FailedInternally":
        {
            name: "Failed internally",
            accent: "negative",
            value: 3
        }
    };
}
