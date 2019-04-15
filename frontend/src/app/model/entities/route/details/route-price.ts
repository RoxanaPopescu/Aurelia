/**
 * Represents an overview of the price of a route.
 */
export class RoutePrice
{
    public constructor(data: any)
    {
        this.price = data.priceWithoutVat;
        this.vat = data.vat;
        this.currencyCode = data.currencyCode;
    }

    /**
     * The price of the route, excluding VAT.
     */
    public readonly price: number;

    /**
     * The VAT to be added to the price.
     */
    public readonly vat: number;

    /**
     * The ISO 4217 currency code.
     */
    public readonly currencyCode: string;

    /**
     * The total price, including VAT.
     */
    public get totalPrice(): number
    {
        return this.price + this.vat;
    }
}