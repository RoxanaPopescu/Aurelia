import { textCase } from "shared/utilities";
import directionNames from "../resources/strings/sort-direction-names.json";

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
        "ascending":
        {
            name: directionNames.ascending,
            value: 1
        },
        "descending":
        {
            name: directionNames.descending,
            value: 2
        }
    };
}
