import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `OrganizationConnectionStatus`.
 */
export type OrganizationConnectionStatusSlug = keyof typeof OrganizationConnectionStatus.values;

/**
 * Represents the status of an `OrganizationConnection`.
 */
export class OrganizationConnectionStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the OrganizationConnection.
     */
    public constructor(slug: OrganizationConnectionStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, OrganizationConnectionStatus.values[this.slug]);
    }

    public slug: OrganizationConnectionStatusSlug;
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
        "invite-sent":
        {
            name: "Invite sent",
            accent: "neutral"
        },
        "invite-received":
        {
            name: "Invite received",
            accent: "neutral"
        }
    };
}
