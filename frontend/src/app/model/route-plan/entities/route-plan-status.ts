import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import statusNames from "../resources/strings/route-plan-status-names.json";

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
        "executing":
        {
            name: statusNames.executing,
            accent: "neutral"
        },
        "calculation-completed":
        {
            name: statusNames.calculationCompleted,
            accent: "neutral"
        },
        "waiting-for-approval":
        {
            name: statusNames.waitingForApproval,
            accent: "attention"
        },
        "succeeded":
        {
            name: statusNames.succeeded,
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
        }
    };
}
