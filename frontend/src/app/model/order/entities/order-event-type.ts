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
                description: undefined,
                accent: "attention",
                stopType: undefined
            });
        }
    }

    public slug: OrderEventTypeSlug;
    public name: string;
    public description: string | undefined;
    public accent: { pickup: Accent; delivery: Accent };
    public stopType: "pickup" | "delivery" | undefined;

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
            accent: "positive",
            stopType: undefined
        },
        "order-added-to-route":
        {
            name: "Order added to route",
            description: "The order was added to a route.",
            accent: "positive",
            stopType: undefined
        },
        "order-ready":
        {
            name: "Order marked as ready",
            description: "The order was marked as ready.",
            accent: "positive",
            stopType: undefined
        },
        "order-pickup-arrived":
        {
            name: "Arrived at pickup location",
            description: "The driver has arrived at the pickup location.",
            accent: "positive",
            stopType: "pickup"
        },
        "order-pickup-completed":
        {
            name: "Pickup completed",
            description: "The order was picked up by the driver.",
            accent: "positive",
            stopType: "pickup"
        },
        "order-delivery-completed":
        {
            name: "Delivery completed",
            description: "The order was delivered to the recipient.",
            accent: "positive",
            stopType: "delivery"
        },
        "order-pickup-failed":
        {
            name: "Order pickup failed",
            description: "The order could not be picked up from the sender.",
            accent: "negative",
            stopType: "pickup"
        },
        "order-delivery-failed":
        {
            name: "Delivery failed",
            description: "The order could not be delivered to the recipient.",
            accent: "negative",
            stopType: "delivery"
        },
        "order-provider-accepted":
        {
            name: "Order provider accepted",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "order-pickup-accepted":
        {
            name: "Order pickup accepted",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "order-delivery-arrived":
        {
            name: "Arrived at delivery location",
            description: "The driver has arrived at the delivery location.",
            accent: "positive",
            stopType: "delivery"
        },
        "order-cancelled-en-route":
        {
            name: "Order cancelled en route",
            description: "The order was cancelled while en rute.",
            accent: "positive",
            stopType: undefined
        },
        "order-return-completed":
        {
            name: "Order return completed",
            description: undefined,
            accent: "positive",
            stopType: "return"
        },
        "order-delivery-eta-provided":
        {
            name: "Estimated delivery",
            description: "The estimated time of arrival at the delivery location.",
            accent: "neutral",
            stopType: "delivery"
        },
        "order-pickup-eta-provided":
        {
            name: "Estimated pickup",
            description: "The estimated time of arrival at the pickup location.",
            accent: "neutral",
            stopType: "pickup"
        },
        "collo-loaded-on-linehaul":
        {
            name: "Collo loaded on linehaul",
            description: "The collo was loaded on a linehaul.",
            accent: "positive",
            stopType: undefined
        },
        "collo-unloaded-from-linehaul":
        {
            name: "Collo unloaded from linehaul",
            description: "The collo was loaded off a linehaul.",
            accent: "positive",
            stopType: undefined
        },
        "collo-enterede-storage":
        {
            name: "Collo entered storage",
            description: "The collo entered storage.",
            accent: "positive",
            stopType: undefined
        }
        ,
        "collo-left-storage":
        {
            name: "Collo left storage",
            description: "The collo left storage.",
            accent: "positive",
            stopType: undefined
        },
        "collo-label-created":
        {
            name: "Collo label created",
            description: "The label for the collo was created.",
            accent: "positive",
            stopType: undefined
        },
        "collo-missing":
        {
            name: "Collo missing",
            description: "The collo was reported as missing.",
            accent: "negative",
            stopType: undefined
        },
        "collo-damaged":
        {
            name: "Collo damaged",
            description: "The collo was reported as damaged.",
            accent: "negative",
            stopType: undefined
        },
        "collo-removed-from-linehaul":
        {
            name: "Collo removed from linehaul",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "collo-delivery-completed":
        {
            name: "Collo delivery completed",
            description: undefined,
            accent: "positive",
            stopType: "delivery"
        },
        "collo-pickup-completed":
        {
            name: "Collo pickup completed",
            description: undefined,
            accent: "positive",
            stopType: "pickup"
        },
        "collo-delivery-arrived":
        {
            name: "Collo delivery arrived",
            description: undefined,
            accent: "positive",
            stopType: "delivery"
        },
        "collo-delivery-failed":
        {
            name: "Collo delivery failed",
            description: undefined,
            accent: "negative",
            stopType: "delivery"
        },
        "collo-pickup-failed":
        {
            name: "Collo pickup failed",
            description: undefined,
            accent: "negative",
            stopType: "pickup"
        },
        "collo-pickup-accepted":
        {
            name: "Collo pickup accepted",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "staging-collo-missing":
        {
            name: "Staging collo missing",
            description: undefined,
            accent: "negative",
            stopType: undefined
        },
        "staging-collo-damaged":
        {
            name: "Staging collo damaged",
            description: undefined,
            accent: "negative",
            stopType: undefined
        },
        "staging-collo-validated":
        {
            name: "Staging collo validated",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "collection-point-order-deleted":
        {
            name: "Collection point order deleted",
            description: undefined,
            accent: "neutral",
            stopType: undefined
        },
        "collection-point-collo-missing":
        {
            name: "Collection point collo missing",
            description: undefined,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-damaged":
        {
            name: "Collection point collo damaged",
            description: undefined,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-collected":
        {
            name: "Collection point collo collected",
            description: undefined,
            accent: "positive",
            stopType: undefined
        },
        "collection-point-collo-not-collected":
        {
            name: "Collection point collo not collected",
            description: undefined,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-rejected":
        {
            name: "Collection point collo rejected",
            description: undefined,
            accent: "negative",
            stopType: undefined
        }
    };
}
