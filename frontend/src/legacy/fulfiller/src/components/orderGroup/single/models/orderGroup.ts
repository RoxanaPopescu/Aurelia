export class OrderGroup {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.name = data.name;
    this.postalCodes = data.postalCodes;
    this.customer = data.customer;
  }

  public name: string;

  public postalCodes: string[];

  public consignors: string[];

  public customer: string;
}
