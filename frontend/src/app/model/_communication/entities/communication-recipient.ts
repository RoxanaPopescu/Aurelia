import { textCase } from "shared/utilities";
import recipient from "../resources/strings/communication-recipients.json";

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
        if (this.slug === "custom")
        {
            throw new Error("Cannot serialize a recipient of the unspecified custom type.");
        }

        return this.slug === "custom-email" || this.slug === "custom-phone" ? undefined : this.slug;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "delivery-customer":
        {
            name: recipient.DeliveryCustomer
        },

        "pickup-customer":
        {
            name: recipient.PickupCustomer
        },

        "driver":
        {
            name: recipient.Driver
        },

        "supplier":
        {
            name: recipient.Supplier
        },

        "custom-email":
        {
            name: recipient.CustomEmail
        },

        "custom-phone":
        {
            name: recipient.CustomPhone
        },

        // HACK: The backend models all custom recipient types as undefined,
        // and we don't have the `to` value in the models used in the list view,
        // so we cannot infer the type. As a workaround, this have this unspecified
        // custom type, which should only be used to support filtering in the list view.
        "custom":
        {
            name: recipient.custom
        }
    };
}
