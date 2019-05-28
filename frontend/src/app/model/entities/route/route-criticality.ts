/**
 * Represents the slug identifying a `RouteCriticality`.
 */
export type RouteCriticalitySlug = keyof typeof RouteCriticality.map;

/**
 * Represents the criticality of a route, which is an indication of
 * how much attention it requires from the operations team.
 */
export class RouteCriticality
{
    public constructor(slug: keyof typeof RouteCriticality.map)
    {
        this.slug = slug;
        Object.assign(this, RouteCriticality.map[slug]);
    }

    public slug: keyof typeof RouteCriticality.map;
    public name: string;
    public rank: number;

    public static readonly map =
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
