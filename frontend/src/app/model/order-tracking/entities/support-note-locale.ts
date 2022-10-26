/**
 * Represents the code identifying a `SupportNoteLocale`.
 */
export type SupportNoteLocaleSlug = keyof typeof SupportNoteLocale.values;

/**
 * Represents a locale for which a support note may be specified.
 */
export class SupportNoteLocale
{
    public constructor(code: SupportNoteLocaleSlug)
    {
        this.code = code;
        Object.assign(this, SupportNoteLocale.values[this.code]);
    }

    public code: SupportNoteLocaleSlug;
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
