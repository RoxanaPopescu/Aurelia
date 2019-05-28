/**
 * Represents the slug identifying a `SortingDirection`.
 */
export type SortingDirectionSlug = keyof typeof SortingDirection.map;

/**
 * Represents a sorting direction.
 */
export class SortingDirection
{
    public constructor(slug: keyof typeof SortingDirection.map)
    {
        this.slug = slug;
        Object.assign(this, SortingDirection.map[slug]);
    }

    public slug: keyof typeof SortingDirection.map;
    public name: string;
    public value: number;

    public static readonly map =
    {
        "ascending":
        {
            name: "Ascending",
            value: 1
        },
        "descending":
        {
            name: "Descending",
            value: 2
        }
    };
}
