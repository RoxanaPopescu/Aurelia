/**
 * Represents the slug identifying a `RouteCriticality`.
 */
export type RouteCriticalitySlug = keyof typeof RouteCriticality.values;

/**
 * Represents the criticality of a route, which is an indication of
 * how much attention it requires from the operations team.
 */
export class RouteCriticality
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the criticality of the route.
     */
    public constructor(slug: RouteCriticalitySlug)
    {
        this.slug = slug;
        Object.assign(this, RouteCriticality.values[slug]);
    }

    public slug: RouteCriticalitySlug;
    public name: string;
    public rank: number;

    public static readonly values =
    {
        "high":
        {
            name: "High",
            rank: 2
        },
        "medium":
        {
            name: "Medium",
            rank: 1
        },
        "low":
        {
            name: "Low",
            rank: 0
        }
    };
}
