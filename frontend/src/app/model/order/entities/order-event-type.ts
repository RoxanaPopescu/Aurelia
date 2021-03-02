import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `OrderEventType`.
 */
export type OrderEventTypeSlug = keyof typeof OrderEventType.values;

/**
 * Represents the status of a order event.
 */
export class OrderEventType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order event.
     */
    public constructor(slug: OrderEventTypeSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;

        if (this.slug in OrderEventType.values)
        {
            Object.assign(this, OrderEventType.values[this.slug]);
        }
        else
        {
            // HACK: Due to lack of proper docs, we support unknown events here. ¯\_(ツ)_/¯
            Object.assign(this,
            {
                name: textCase(this.slug, "kebab", "sentence"),
                description: "Unknown order event.",
                accent: "attention"
            });
        }
    }

    public slug: OrderEventTypeSlug;
    public name: string;
    public description: string;
    public accent: { pickup: Accent; delivery: Accent };

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
        "order-created":
        {
            name: "Order created",
            description: "The order was created.",
            accent: "positive"
        },
        "order-added-to-route":
        {
            name: "Order added to route",
            description: "The order was added to a route.",
            accent: "positive"
        },
        "order-ready":
        {
            name: "Order ready",
            description: "The order was marked as ready.",
            accent: "positive"
        },
        "order-pickup-arrived":
        {
            name: "Arrived at pickup location",
            description: "The driver has arrived at the pickup location.",
            accent: "positive"
        },
        "order-pickup-completed":
        {
            name: "Pickup completed",
            description: "The order was picked up by the driver.",
            accent: "positive"
        },
        "order-delivery-completed":
        {
            name: "Delivery completed",
            description: "The order was delivered to the recipient.",
            accent: "positive"
        },
        "order-pickup-failed":
        {
            name: "Order pickup failed",
            description: "The order could not be picked up from the sender.",
            accent: "negative"
        },
        "order-delivery-failed":
        {
            name: "Delivery failed",
            description: "The order could not be delivered to the recipient.",
            accent: "negative"
        },
        "order-provider-accepted":
        {
            name: "Order provider accepted",
            description: "TODO",
            accent: "positive"
        },
        "order-pickup-accepted":
        {
            name: "Order pickup accepted",
            description: "TODO",
            accent: "positive"
        },
        "order-delivery-arrived":
        {
            name: "Arrived at delivery location",
            description: "The driver has arrived at the delivery location.",
            accent: "positive"
        },
        "order-cancelled-en-route":
        {
            name: "Order cancelled en route",
            description: "The order was cancelled while en rute.",
            accent: "positive"
        },
        "order-return-completed":
        {
            name: "Order return completed",
            description: "TODO",
            accent: "positive"
        },
        "order-assigned-to-route":
        {
            name: "Order assigned to route",
            description: "TODO",
            accent: "positive"
        },
        "order-delivery-eta-provided":
        {
            name: "Estimated delivery",
            description: "The estimated time of arrival at the delivery location.",
            accent: "neutral"
        },
        "order-pickup-eta-provided":
        {
            name: "Estimated pickup",
            description: "The estimated time of arrival at the pickup location.",
            accent: "neutral"
        },
        "collo-loaded-on-linehaul":
        {
            name: "Collo loaded on linehaul",
            description: "The collo was loaded on a linehaul.",
            accent: "positive"
        },
        "collo-unloaded-from-linehaul":
        {
            name: "Collo unloaded from linehaul",
            description: "The collo was loaded off a linehaul.",
            accent: "positive"
        },
        "collo-enterede-storage":
        {
            name: "Collo entered storage",
            description: "The collo entered storage.",
            accent: "positive"
        }
        ,
        "collo-left-storage":
        {
            name: "Collo left storage",
            description: "The collo left storage.",
            accent: "positive"
        },
        "collo-missing":
        {
            name: "Collo missing",
            description: "The collo was reported as missing.",
            accent: "negative"
        },
        "collo-damaged":
        {
            name: "Collo damaged",
            description: "The collo was reported as damaged.",
            accent: "negative"
        },
        "collo-removed-from-linehaul":
        {
            name: "Collo removed from linehaul",
            description: "TODO",
            accent: "positive"
        },
        "collo-delivery-completed":
        {
            name: "Collo delivery completed",
            description: "TODO",
            accent: "positive"
        },
        "collo-pickup-completed":
        {
            name: "Collo pickup completed",
            description: "TODO",
            accent: "positive"
        },
        "collo-delivery-arrived":
        {
            name: "Collo delivery arrived",
            description: "TODO",
            accent: "positive"
        },
        "collo-delivery-failed":
        {
            name: "Collo delivery failed",
            description: "TODO",
            accent: "negative"
        },
        "collo-pickup-failed":
        {
            name: "Collo pickup failed",
            description: "TODO",
            accent: "negative"
        },
        "collo-pickup-accepted":
        {
            name: "Collo pickup accepted",
            description: "TODO",
            accent: "positive"
        },
        "staging-collo-missing":
        {
            name: "Staging collo missing",
            description: "TODO",
            accent: "negative"
        },
        "staging-collo-damaged":
        {
            name: "Staging collo damaged",
            description: "TODO",
            accent: "negative"
        },
        "staging-collo-validated":
        {
            name: "Staging collo validated",
            description: "TODO",
            accent: "positive"
        },
        "collection-point-collo-missing":
        {
            name: "Collection point collo missing",
            description: "TODO",
            accent: "negative"
        },
        "collection-point-collo-damaged":
        {
            name: "Collection point collo damaged",
            description: "TODO",
            accent: "negative"
        },
        "collection-point-collo-collected":
        {
            name: "Collection point collo collected",
            description: "TODO",
            accent: "positive"
        },
        "collection-point-collo-not-collected":
        {
            name: "Collection point collo not collected",
            description: "TODO",
            accent: "negative"
        },
        "collection-point-collo-rejected":
        {
            name: "Collection point collo rejected",
            description: "TODO",
            accent: "negative"
        }
    };
}
