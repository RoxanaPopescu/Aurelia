import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import eventTitles from "../resources/strings/order-event-titles.json";
import eventDescriptions from "../resources/strings/order-event-descriptions.json";

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
            name: eventTitles.orderCreated,
            description: eventDescriptions.orderCreated,
            accent: "positive",
            stopType: undefined
        },
        "order-added-to-route":
        {
            name: eventTitles.orderAddedToRoute,
            description: eventDescriptions.orderAddedToRoute,
            accent: "positive",
            stopType: undefined
        },
        "order-ready":
        {
            name: eventTitles.orderReady,
            description: eventDescriptions.orderReady,
            accent: "positive",
            stopType: undefined
        },
        "order-pickup-arrived":
        {
            name: eventTitles.orderPickupArrived,
            description: eventDescriptions.orderPickupArrived,
            accent: "positive",
            stopType: "pickup"
        },
        "order-pickup-completed":
        {
            name: eventTitles.orderPickupCompleted,
            description: eventDescriptions.orderPickupCompleted,
            accent: "positive",
            stopType: "pickup"
        },
        "order-delivery-completed":
        {
            name: eventTitles.orderDeliveryCompleted,
            description: eventDescriptions.orderDeliveryCompleted,
            accent: "positive",
            stopType: "delivery"
        },
        "order-pickup-failed":
        {
            name: eventTitles.orderPickupFailed,
            description: eventDescriptions.orderPickupFailed,
            accent: "negative",
            stopType: "pickup"
        },
        "order-delivery-failed":
        {
            name: eventTitles.orderDeliveryFailed,
            description: eventDescriptions.orderDeliveryFailed,
            accent: "negative",
            stopType: "delivery"
        },
        "order-provider-accepted":
        {
            name: eventTitles.orderProviderAccepted,
            description: eventDescriptions.orderProviderAccepted,
            accent: "positive",
            stopType: undefined
        },
        "order-pickup-accepted":
        {
            name: eventTitles.orderPickupAccepted,
            description: eventDescriptions.orderPickupAccepted,
            accent: "positive",
            stopType: undefined
        },
        "order-delivery-arrived":
        {
            name: eventTitles.orderDeliveryArrived,
            description: eventDescriptions.orderDeliveryArrived,
            accent: "positive",
            stopType: "delivery"
        },
        "order-delivery-eta-provided":
        {
            name: eventTitles.orderDeliveryEtaProvided,
            description: eventDescriptions.orderDeliveryEtaProvided,
            accent: "neutral",
            stopType: "delivery"
        },
        "order-pickup-eta-provided":
        {
            name: eventTitles.orderPickupEtaProvided,
            description: eventDescriptions.orderPickupEtaProvided,
            accent: "neutral",
            stopType: "pickup"
        },
        "collo-loaded-on-linehaul":
        {
            name: eventTitles.colloLoadedOnLinehaul,
            description: eventDescriptions.colloLoadedOnLinehaul,
            accent: "positive",
            stopType: undefined
        },
        "collo-unloaded-from-linehaul":
        {
            name: eventTitles.colloUnloadedFromLinehaul,
            description: eventDescriptions.colloUnloadedFromLinehaul,
            accent: "positive",
            stopType: undefined
        },
        "collo-enterede-storage":
        {
            name: eventTitles.colloEnteredeStorage,
            description: eventDescriptions.colloEnteredeStorage,
            accent: "positive",
            stopType: undefined
        }
        ,
        "collo-left-storage":
        {
            name: eventTitles.colloLeftStorage,
            description: eventDescriptions.colloLeftStorage,
            accent: "positive",
            stopType: undefined
        },
        "collo-label-created":
        {
            name: eventTitles.colloLabelCreated,
            description: eventDescriptions.colloLabelCreated,
            accent: "positive",
            stopType: undefined
        },
        "collo-missing":
        {
            name: eventTitles.colloMissing,
            description: eventDescriptions.colloMissing,
            accent: "negative",
            stopType: undefined
        },
        "collo-damaged":
        {
            name: eventTitles.colloDamaged,
            description: eventDescriptions.colloDamaged,
            accent: "negative",
            stopType: undefined
        },
        "collo-removed-from-linehaul":
        {
            name: eventTitles.colloRemovedFromLinehaul,
            description: eventDescriptions.colloRemovedFromLinehaul,
            accent: "positive",
            stopType: undefined
        },
        "collo-delivery-completed":
        {
            name: eventTitles.colloDeliveryCompleted,
            description: eventDescriptions.colloDeliveryCompleted,
            accent: "positive",
            stopType: "delivery"
        },
        "collo-pickup-completed":
        {
            name: eventTitles.colloPickupCompleted,
            description: eventDescriptions.colloPickupCompleted,
            accent: "positive",
            stopType: "pickup"
        },
        "collo-delivery-arrived":
        {
            name: eventTitles.colloDeliveryArrived,
            description: eventDescriptions.colloDeliveryArrived,
            accent: "positive",
            stopType: "delivery"
        },
        "collo-delivery-failed":
        {
            name: eventTitles.colloDeliveryFailed,
            description: eventDescriptions.colloDeliveryFailed,
            accent: "negative",
            stopType: "delivery"
        },
        "collo-pickup-failed":
        {
            name: eventTitles.colloPickupFailed,
            description: eventDescriptions.colloPickupFailed,
            accent: "negative",
            stopType: "pickup"
        },
        "collo-pickup-accepted":
        {
            name: eventTitles.colloPickupAccepted,
            description: eventDescriptions.colloPickupAccepted,
            accent: "positive",
            stopType: undefined
        },
        "staging-collo-missing":
        {
            name: eventTitles.stagingColloMissing,
            description: eventDescriptions.stagingColloMissing,
            accent: "negative",
            stopType: undefined
        },
        "staging-collo-damaged":
        {
            name: eventTitles.stagingColloDamaged,
            description: eventDescriptions.stagingColloDamaged,
            accent: "negative",
            stopType: undefined
        },
        "staging-collo-validated":
        {
            name: eventTitles.stagingColloValidated,
            description: eventDescriptions.stagingColloValidated,
            accent: "positive",
            stopType: undefined
        },
        "collection-point-order-deleted":
        {
            name: eventTitles.collectionPointOrderDeleted,
            description: eventDescriptions.collectionPointOrderDeleted,
            accent: "neutral",
            stopType: undefined
        },
        "collection-point-collo-missing":
        {
            name: eventTitles.collectionPointColloMissing,
            description: eventDescriptions.collectionPointColloMissing,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-damaged":
        {
            name: eventTitles.collectionPointColloDamaged,
            description: eventDescriptions.collectionPointColloDamaged,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-collected":
        {
            name: eventTitles.collectionPointColloCollected,
            description: eventDescriptions.collectionPointColloCollected,
            accent: "positive",
            stopType: undefined
        },
        "collection-point-collo-not-collected":
        {
            name: eventTitles.collectionPointColloNotCollected,
            description: eventDescriptions.collectionPointColloNotCollected,
            accent: "negative",
            stopType: undefined
        },
        "collection-point-collo-rejected":
        {
            name: eventTitles.collectionPointColloRejected,
            description: eventDescriptions.collectionPointColloRejected,
            accent: "negative",
            stopType: undefined
        },
        "authority-to-leave-granted":
        {
            name: eventTitles.authorityToLeaveGranted,
            description: eventDescriptions.authorityToLeaveGranted,
            accent: "positive",
            stopType: undefined
        },
        "authority-to-leave-revoked":
        {
            name: eventTitles.authorityToLeaveRevoked,
            description: eventDescriptions.authorityToLeaveRevoked,
            accent: "positive",
            stopType: undefined
        },
        "notification-order-sms-sent":
        {
            name: eventTitles.notificationOrderSmsSent,
            description: eventDescriptions.notificationOrderSmsSent,
            accent: "positive",
            stopType: undefined
        },
        "notification-order-email-sent":
        {
            name: eventTitles.notificationOrderEmailSent,
            description: eventDescriptions.notificationOrderEmailSent,
            accent: "positive",
            stopType: undefined
        },
        "order-removed-from-route":
        {
            name: eventTitles.orderRemovedFromRoute,
            description: eventDescriptions.orderRemovedFromRoute,
            accent: "positive",
            stopType: undefined
        }
    };
}
