import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";
import routeStatus from "../resources/strings/route-status.json"

/**
 * Represents the slug identifying a `RouteStatus`.
 */
export type RouteStatusSlug = keyof typeof RouteStatus.values;

/**
 * Represents the status of a route.
 */
export class RouteStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route.
     */
    public constructor(slug: RouteStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteStatus.values[this.slug]);
    }

    public slug: RouteStatusSlug;
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
        "not-started":
        {
            name: routeStatus.notStarted,
            accent: "neutral",
            value: 1
        },
        "in-progress":
        {
            name: routeStatus.InProgress,
            accent: "attention",
            value: 2
        },
        "not-approved":
        {
            name: routeStatus.notApproved,
            accent: "attention",
            value: 3
        },
        "completed":
        {
            name: routeStatus.completed,
            accent: "positive",
            value: 4
        },
        "cancelled":
        {
            name: routeStatus.cancelled,
            accent: "negative",
            value: 5
        },
        "to-be-express-dispatched":
        {
            name: routeStatus.toBeExpressDispatched,
            accent: "neutral",
            value: 6
        }
    };
}
