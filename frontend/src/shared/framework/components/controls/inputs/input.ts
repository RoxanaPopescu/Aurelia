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

export type AutocapitalizeHint =
    "off" | "characters" | "words" | "sentences";
/**
 * Represents the type of `Enter` key to show on a virtual keyboard for a single-line text input.
 */
export type EnterKeyHint =
    "go" | "done" | "next" | "search" | "send";
