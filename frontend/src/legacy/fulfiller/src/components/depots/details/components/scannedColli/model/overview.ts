export class ScannedColliOverview {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.missing = data.missing;
    this.scanned = data.scanned;
    this.total = data.total;
    this.colliMissingByConsignors = data.colliMissingByConsignors;
  }

  colliMissingByConsignors: {
    consignorName: string;
    consignorId: string;
    missing: number;
    scanned: number;
    total: number;
  }[];
  missing: number;
  scanned: number;
  total: number;
}
