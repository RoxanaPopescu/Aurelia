/**
 * Represents info about a currency.
 */
export interface ICurrency
{
    /**
     * The ISO 4217 currency code identifying the currency.
     * This value is case sensitive.
     */
    code: string;

    /**
     * The name of the currency.
     */
    name: string;

    /**
     * The currency symbol to use when presenting a value.
     */
    symbol?: string;
}
