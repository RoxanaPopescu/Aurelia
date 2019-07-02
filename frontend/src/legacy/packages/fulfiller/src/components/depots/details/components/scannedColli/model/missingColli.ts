export class MissingColli {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.colliId = data.colliId;
    this.barcode = data.barcode;
    this.consignorId = data.consignorId;
    this.consignorCompanyName = data.consignorCompanyName;
    this.locationId = data.locationId;
    this.orderId = data.orderId;
    this.routeSlug = data.routeSlug;
    this.routeReference = data.routeReference;
    this.stopNumber = data.stopNumber;
    this.slug = data.slug;
  }

  colliId: string;
  barcode: string;
  consignorId: string;
  consignorCompanyName: string;
  locationId: string;
  orderId: string;
  routeSlug: string;
  routeReference: string;
  stopNumber: string;
  slug: string;
}
