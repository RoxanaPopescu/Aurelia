import { textCase } from "shared/utilities";
import triggerEvents from "../resources/strings/communication-trigger-events.json"

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
        "order-delivery-arrived":
        {
            name: triggerEvents.OrderDeliveryArrived
        },
        "order-pickup-completed":
        {
            name: triggerEvents.OrderPickupCompleted
        },
        "order-delivery-completed":
        {
            name: triggerEvents.OrderDeliveryCompleted
        },
        "order-delivery-failed":
        {
            name: triggerEvents.OrderDeliveryFailed
        },
        "order-delivery-eta-provided":
        {
            name: triggerEvents.OrderDeliveryDelayedETALProvided
        },
        "order-pickup-eta-provided":
        {
            name: triggerEvents.OrderPickupETAProvided
        },
        "order-delivery-delayed-eta-provided":
        {
            name: triggerEvents.OrderDeliveryDelayedETALProvided
        },
        "order-schedule-triggered":
        {
            name: triggerEvents.OrderScheduleTriggered
        }
    };
}
