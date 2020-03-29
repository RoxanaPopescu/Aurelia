import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `CommunicationTriggerEvent`.
 */
export type CommunicationTriggerEventSlug = keyof typeof CommunicationTriggerEvent.values;

/**
 * Represents an event that triggers the sending of a message.
 */
export class CommunicationTriggerEvent
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: CommunicationTriggerEventSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, CommunicationTriggerEvent.values[this.slug]);
    }

    public slug: CommunicationTriggerEventSlug;
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
        "delivery":
        {
            name: "Delivery"
        },
        "pickup":
        {
            name: "Pickup"
        },
        "ready-for-pickup":
        {
            name: "Ready for pickup"
        },
        "arrival-at-terminal":
        {
            name: "Arrival at terminal"
        }
    };
}
