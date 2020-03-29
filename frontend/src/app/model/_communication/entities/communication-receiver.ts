import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `CommunicationReceiver`.
 */
export type CommunicationReceiverSlug = keyof typeof CommunicationReceiver.values;

/**
 * Represents a receiver of a message.
 */
export class CommunicationReceiver
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: CommunicationReceiverSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, CommunicationReceiver.values[this.slug]);
    }

    public slug: CommunicationReceiverSlug;
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
        "receiver-1-slug":
        {
            name: "Receiver 1"
        }
    };
}
