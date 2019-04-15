import { observable, computed } from "mobx";

/**
 * Represents a phone
 */
export class Phone {
  /* tslint:disable-next-line: no-any */
  public constructor(data?: any) {
    if (data != null) {
      this.countryPrefix = data.countryPrefix;
      this.number = data.number;
    } else {
      this.countryPrefix = "45";
    }
  }

  /**
   * The prefix identifying the country to which the phone number belongs.
   */
  @observable
  public countryPrefix: string;

  /**
   * The phone number, excluding the country prefix.
   */
  @observable
  public number: string;

  /**
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return !!(
      /^\d{1,3}$/.test(this.countryPrefix) &&
      /^(\s*\d\s*){8}$/.test(this.number)
    );
  }

  /**
   * The phone number formatted for presentation to a user,
   * including the country prefix.
   */
  public toString(): string {
    const formattedNumber = this.number ?
      this.number.match(/.{1,2}/g)!.join(" ") :
      "";
    return this.countryPrefix ?
      `${this.countryPrefix} ${formattedNumber}` :
      formattedNumber;
  }
}
