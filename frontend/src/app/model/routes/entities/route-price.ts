/**
 * Represents an overview of the price of a route.
 */
export class RoutePrice
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
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
