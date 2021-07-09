import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `OrganizationUserStatus`.
 */
export type OrganizationUserStatusSlug = keyof typeof OrganizationUserStatus.values;

/**
 * Represents the status of an `OrganizationUser`.
 */
export class OrganizationUserStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the OrganizationUser.
     */
    public constructor(slug: OrganizationUserStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, OrganizationUserStatus.values[this.slug]);
    }

    public slug: OrganizationUserStatusSlug;
    public name: string;
    public accent: Accent;

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
        "active":
        {
            name: "Active",
            accent: "positive"
        },
        "invited":
        {
            name: "Invited",
            accent: "neutral"
        }
    };
}
