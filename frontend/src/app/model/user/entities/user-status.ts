import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `UserStatus`.
 */
export type UserStatusSlug = keyof typeof UserStatus.values;

/**
 * Represents the status of a user.
 */
export class UserStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the user.
     */
    public constructor(slug: UserStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, UserStatus.values[this.slug] || UserStatus.values.unknown);
    }

    public slug: UserStatusSlug;
    public name: string;
    public accent: Accent;
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
        "created":
        {
            name: "Not activated",
            accent: "attention",
            value: 1
        },
        "activated":
        {
            name: "Activated",
            accent: "positive",
            value: 2
        },
        "deactivated":
        {
            name: "Deactivated",
            accent: "neutral",
            value: 666
        },

        // TODO: Needed because I don't know all the possible status values.
        "unknown":
        {
            name: "Unknown",
            accent: "neutral",
            value: undefined
        }
    };
}
