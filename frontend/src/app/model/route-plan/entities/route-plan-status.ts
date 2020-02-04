import { textCase } from "shared/utilities";
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
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RoutePlanStatus.values[this.slug] || { name: slug, accent: "neutral" });
    }

    public slug: RoutePlanStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly values =
    {
        "processing":
        {
            name: "Processing",
            accent: "neutral"
        },
        "waiting-for-approval":
        {
            name: "Waiting for approval",
            accent: "attention"
        },
        "completed":
        {
            name: "Completed",
            accent: "positive"
        },
        "failed-externally":
        {
            name: "Failed externally",
            accent: "negative"
        },
        "failed-internally":
        {
            name: "Failed internally",
            accent: "negative"
        },
        "cancelled":
        {
            name: "Cancelled",
            accent: "neutral"
        }
    };
}
