/**
 * Represents an overview of the price of a route.
 */
export class RoutePrice {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.priceWithoutVat = data.priceWithoutVat;
    this.vat = data.vat;
    this.currencyCode = data.currencyCode;
  }

  /**
   * The price of the route, excluding VAT.
   */
  public readonly priceWithoutVat: number;

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
  public get totalPrice(): number {
    return this.priceWithoutVat + this.vat;
  }
}