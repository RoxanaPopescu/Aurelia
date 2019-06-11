import { Accent } from "app/model/entities/shared";

/**
 * Represents the slug identifying a `ColloStatus`.
 */
export type ColloStatusSlug = keyof typeof ColloStatus.map;

/**
 * Represents the status of a collo.
 */
export class ColloStatus
{
    public constructor(slug: ColloStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, ColloStatus.map[slug]);
    }

    public slug: ColloStatusSlug;
    public name: string;
    public accent: { pickup: Accent, delivery: Accent };

    public static readonly map =
    {
        "not-delivered":
        {
            name: "Missing at delivery",
            accent: { pickup: "negative", delivery: "negative" }
        },
        "not-picked-up":
        {
            name: "Missing at pickup",
            accent: { pickup: "negative", delivery: "negative" }
        },
        "delivery-not-possible":
        {
            name: "Delivery not possible",
            accent: { pickup: "negative", delivery: "negative" }
        },
        "refused-by-driver":
        {
            name: "Delivery refused by driver",
            accent: { pickup: "negative", delivery: "negative" }
        },
        "refused-by-customer":
        {
            name: "Delivery refused by customer",
            accent: { pickup: "negative", delivery: "negative" }
        },
        "no-action":
        {
            name: "Awaiting pickup",
            accent: { pickup: "neutral", delivery: "neutral" }
        },
        "picked-up":
        {
            name: "Picked up",
            accent: { pickup: "positive", delivery: "neutral" }
        },
        "delivered":
        {
            name: "Delivered",
            accent: { pickup: "positive", delivery: "positive" }
        }
    };
}
