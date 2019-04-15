import { Consignor } from "../consignor";

export class MatchingCriterias {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.zipRanges = this.getZips(data.zipRanges);
    this.consignors = data.consignors.map(c => new Consignor(c));
    this.tags = data.tags;
  }

  public zipRanges: string[];
  public tags: string[];
  public consignors: Consignor[];

  // tslint:disable-next-line:no-any
  private getZips(data: any) {
    var array: string[] = [];

    if (data.from && data.to) {
      if (data.from === data.to) {
        array.push(`${data.from}`);
      } else {
        array.push(`${data.from}-${data.to}`);
      }
    }

    return array;
  }
}
