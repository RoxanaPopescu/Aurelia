// Note:
// The input components in this folder depend on the patch
// "src/shared/patches/browser/placeholder-shown-api", which
// provides support for reliable input placeholder detection.

/**
 * Represents the type of autocompletion to use for an input.
 */
export type AutocompleteHint =
    "off" | "on" | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" |
    "email" | "username" | "new-password" | "current-password" | "one-time-code" | "organization-title" | "organization" | "street-address" |
    "address-line1" | "address-line2" | "address-line3" | "address-level4" | "address-level3" | "address-level2" | "address-level1" |
    "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" |
    "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" |
    "bday" | "bday-day" | "bday-month" | "bday-year" | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" |
    "tel-local" | "tel-extension" | "impp" | "url" | "photo";

/**
 * Represents the type of autocorrection to use for an input.
 */
export type AutocorrectHint =
    "on" | "off";

/**
 * Represents the type of autocapitalization to use for an input.
 * Note that we exclude the values "none" and "on" here to enforce consistency.
 */
export type AutocapitalizeHint =
    "off" | "characters" | "words" | "sentences";

/**
 * Represents the type of spellchecking to use for an input.
 * Note that we include a non-standard "multiline" value here, which means only when the input allows multiple lines.
 */
export type SpellcheckHint =
    "on" | "off" | "multiline";

/**
 * Represents the type of `Enter` key to show on a virtual keyboard for a single-line text input.
 */
export type EnterKeyHint =
    "enter" | "done" | "go" | "previous" | "next" | "search" | "send";

/**
 * Represents the position of the label, relative to the input.
 */
export type LabelPosition =
    "inline" | "above";
