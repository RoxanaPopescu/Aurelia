export class DepotRouteRemark {

  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    this.code = data.code;
    this.name = data.name;
  }

  public code: number;
  public name: string;
}