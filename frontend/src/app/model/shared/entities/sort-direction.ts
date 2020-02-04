import { textCase } from "shared/utilities";

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
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, SortingDirection.values[this.slug]);
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
