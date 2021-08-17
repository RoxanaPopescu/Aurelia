import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import statusNames from "../../resources/strings/route-plan-status-names.json";

/**
 * Represents the slug identifying a `RoutePlanStatus`.
 */
export type LegacyRoutePlanStatusSlug = keyof typeof LegacyRoutePlanStatus.values;

/**
 * Represents the status of a route.
 */
export class LegacyRoutePlanStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route plan.
     */
    public constructor(slug: LegacyRoutePlanStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, LegacyRoutePlanStatus.values[this.slug] || { name: slug, accent: "neutral" });
    }

    public slug: LegacyRoutePlanStatusSlug;
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
            name: statusNames.executing,
            accent: "neutral"
        },
        "waiting-for-approval":
        {
            name: statusNames.waitingForApproval,
            accent: "attention"
        },
        "completed":
        {
            name: statusNames.calculationCompleted,
            accent: "positive"
        },
        "failed-externally":
        {
            name: statusNames.failed,
            accent: "negative"
        },
        "failed-internally":
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
