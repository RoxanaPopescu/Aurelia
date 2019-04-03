import { observable, computed } from "mobx";

/**
 * Represents the name of a person.
 */
export class PersonName {

  /* tslint:disable-next-line: no-any */
  public constructor(data?: any) {
    if (data != null) {
      this.first = data.first || "";
      this.last = data.last || "";
    }
  }

  /**
   * The given name or names.
   */
  @observable
  public first: string;

  /**
   * The family name or names, if any.
   */
  @observable
  public last: string;

  /**
   * The initials to be used instead of the name, where space is limited.
   */
  @computed
  public get initials(): string {
    return (this.first[0] || "") + (this.last[0] || "").toUpperCase();
  }

  /**
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return !!(
      this.first &&
      this.last
    );
  }

  /**
   * Formats the name for presentation.
   */
  public toString(): string {
    return `${this.first} ${this.last}`;
  }

  /**
   * Gets the data that should be serialized to JSON.
   */
  // tslint:disable-next-line:no-any
  public toJSON(): any {
    return {
      first: this.first,
      last: this.last
    };
  }
}
