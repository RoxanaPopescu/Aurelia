import { textCase } from "shared/utilities";
import { Accent } from "app/model/shared";
import statusNames from "../resources/strings/collo-status-names.json";

/**
 * Represents the slug identifying a `ColloStatus`.
 */
export type ColloStatusSlug = keyof typeof ColloStatus.values;

/**
 * Represents the status of a collo.
 */
export class ColloStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the collo.
     */
    public constructor(slug: ColloStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, ColloStatus.values[this.slug]);
    }

    public slug: ColloStatusSlug;
    public name: string;
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
        "not-delivered":
        {
            name: statusNames.notDelivered,
            accent: { pickup: "negative", delivery: "negative" }
        },
        "not-picked-up":
        {
            name: statusNames.notPickedUp,
            accent: { pickup: "negative", delivery: "negative" }
        },
        "delivery-not-possible":
        {
            name: statusNames.deliveryNotPossible,
            accent: { pickup: "negative", delivery: "negative" }
        },
        "refused-by-driver":
        {
            name: statusNames.refusedByDriver,
            accent: { pickup: "negative", delivery: "negative" }
        },
        "refused-by-customer":
        {
            name: statusNames.refusedByCustomer,
            accent: { pickup: "negative", delivery: "negative" }
        },
        "no-action":
        {
            name: statusNames.noAction,
            accent: { pickup: "neutral", delivery: "neutral" }
        },
        "picked-up":
        {
            name: statusNames.pickedUp,
            accent: { pickup: "positive", delivery: "neutral" }
        },
        "delivered":
        {
            name: statusNames.delivered,
            accent: { pickup: "positive", delivery: "positive" }
        },
        "cancelled":
        {
            name: statusNames.cancelled,
            accent: { pickup: "negative", delivery: "negative" }
        }
    };
}
