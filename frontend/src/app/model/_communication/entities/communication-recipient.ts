import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `CommunicationRecipient`.
 */
export type CommunicationRecipientSlug = keyof typeof CommunicationRecipient.values;

/**
 * Represents a recipient of a message.
 */
export class CommunicationRecipient
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: CommunicationRecipientSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, CommunicationRecipient.values[this.slug]);
    }

    public slug: CommunicationRecipientSlug;
    public name: string;

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
        "recipient-1-slug":
        {
            name: "Recipient 1"
        }
    };
}
