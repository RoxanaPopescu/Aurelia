/**
 * Represents an amount of a currency.
 */
export interface ICurrencyValue
{
    /**
     * The amount of the currency.
     */
    amount: number;

    /**
     * The ISO 4217 Alpha currency code identifying the currency.
     */
    currencyCode: string;
}
