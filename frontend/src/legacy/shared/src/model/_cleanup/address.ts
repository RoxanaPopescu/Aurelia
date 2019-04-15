export class Address {
  formatted: string;
  primary: string;
  secondary: string;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.primary = json.primaryFormatted;
    this.secondary = json.secondaryFormatted;
    this.formatted = json.formatted;
  }
}
