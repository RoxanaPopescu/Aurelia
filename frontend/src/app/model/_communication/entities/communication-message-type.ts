import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `CommunicationMessageType`.
 */
export type CommunicationMessageTypeSlug = keyof typeof CommunicationMessageType.values;

/**
 * Represents the type of a message.
 */
export class CommunicationMessageType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: CommunicationMessageTypeSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, CommunicationMessageType.values[this.slug]);
    }

    public slug: CommunicationMessageTypeSlug;
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
        "sms":
        {
            name: "SMS"
        },
        "email":
        {
            name: "Email"
        },
        "push-to-driver":
        {
            name: "Push notification to driver"
        }
    };
}
