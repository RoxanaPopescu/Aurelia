/**
 * Represents the code identifying a `OrderTrackingLocale`.
 */
export type OrderTrackingLocaleSlug = keyof typeof OrderTrackingLocale.values;

/**
 * Represents a locale supported by the order tracking page.
 */
export class OrderTrackingLocale
{
    public constructor(code: OrderTrackingLocaleSlug)
    {
        this.code = code;
        Object.assign(this, OrderTrackingLocale.values[this.code]);
    }

    public code: OrderTrackingLocaleSlug;
    public name: string;
    public value: number;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.code;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "en":
        {
            code: "en",
            name: "English"
        },
        "da":
        {
            code: "da",
            name: "Danish"
        },
        "it":
        {
            code: "it",
            name: "Italian"
        },
        "de":
        {
            code: "de",
            name: "German"
        },
        "fr":
        {
            code: "fr",
            name: "French"
        },
        "fi":
        {
            code: "fi",
            name: "Finnish"
        },
        "nl":
        {
            code: "nl",
            name: "Dutch"
        }
    };
}
