import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteStopProblem`.
 */
export type RouteStopProblemSlug = keyof typeof RouteStopProblem.values;

/**
 * Represents a problem associated with a route stop.
 */
export class RouteStopProblem
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = textCase(data.type, "pascal", "kebab") as RouteStopProblemSlug;
        Object.assign(this, RouteStopProblem.values[this.slug]);
        this.description = data.description;
        this.imageUrls = data.imageUrls;
    }

    public slug: RouteStopProblemSlug;
    public name: string;
    public description: string;
    public imageUrls: string[];

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
        "nobody-at-location":
        {
            name: "Nobody at location"
        },
        "damaged-colli":
        {
            name: "Damaged colli"
        },
        "other":
        {
            name: "Other problem"
        },
        "denied":
        {
            name: "Denied"
        },
        "wrong-address":
        {
            name: "Wrong address"
        },
        "gate-occupied":
        {
            name: "Gate occupied"
        },
        "missing-items":
        {
            name: "Missing items"
        },
        "incorrectly-packed":
        {
            name: "Incorrectly packed"
        },
        "missing-colli":
        {
            name: "Missing colli"
        },
        "other-damage":
        {
            name: "Other damage"
        }
    };
}
