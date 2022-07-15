import { MapObject } from "shared/types";
import { textCase } from "shared/utilities/text";

/**
 * Represents a column in a list view.
 */
export abstract class ListViewColumn<TSlug extends string = string>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(values: MapObject, data: { slug: TSlug; width?: string })
    {
        this.slug = data.slug ? textCase(data.slug, "pascal", "kebab") as any : "unknown";
        Object.assign(this, values[this.slug]);

        if (data.width)
        {
            this.width = data.width;
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
     * The width of the column.
     */
    public width: string;

    /**
     * The property to use for sorting.
     */
    public property: string | undefined;

    /**
     * True if the column is hidden, e.g. because it represents an icon, otherwise false.
     */
    public hidden: boolean;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return { slug: this.slug, width: this.width };
    }
}
