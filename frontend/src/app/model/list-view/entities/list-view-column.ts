import { MapObject } from "shared/types";
import { textCase } from "shared/utilities/text";

/**
 * Represents a column in a list view.
 */
export abstract class ListViewColumn<TSlug extends string = string>
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the column.
     * @param width The width of he column, or undefined to use the default.
     */
    public constructor(values: MapObject, slug: TSlug, width?: string)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "unknown";
        Object.assign(this, values[this.slug]);

        if (width)
        {
            this.width = width;
        }

        if (this.visibility === "icon")
        {
            this.width = undefined;
            this.property = undefined;
        }
    }

    /**
     * The slug identifying the column.
     */
    public slug: TSlug;

    /**
     * The localized name of the column.
     */
    public name: string;

    /**
     * The localized short name of the column, suitable for use in a table header.
     */
    public shortName: string;

    /**
     * The width of the column, or undefined if the visibility is not `visible`.
     */
    public width: string | undefined;

    /**
     * The property to use for sorting.
     */
    public property: string | undefined;

    /**
     * The visibility of the column.
     */
    public visibility: "visible" | "icon" | "hidden";

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return { slug: this.slug, width: this.width };
    }
}
