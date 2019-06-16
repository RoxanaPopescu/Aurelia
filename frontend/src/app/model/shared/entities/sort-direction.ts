/**
 * Represents the slug identifying a `SortingDirection`.
 */
export type SortingDirectionSlug = keyof typeof SortingDirection.values;

/**
 * Represents a sorting direction.
 */
export class SortingDirection
{
    public constructor(slug: SortingDirectionSlug)
    {
        this.slug = slug;
        Object.assign(this, SortingDirection.values[slug]);
    }

    public slug: SortingDirectionSlug;
    public name: string;
    public value: number;

    public static readonly values =
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
