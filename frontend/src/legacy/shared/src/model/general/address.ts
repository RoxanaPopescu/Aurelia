/**
 * Represents an address identifying a place in the world.
 */
export class Address {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.provider = data.provider;
      this.primary = data.primary;
      this.secondary = data.secondary;
    }
  }

  /**
   * The id of the address. Used for lookup.
   * Only exists when a full address
   */
  public id?: string;

  /**
   * The name of the provider
   */
  public provider: string;

  /**
   * The primary address information.
   */
  public primary: string;

  /**
   * The secondary address information.
   */
  public secondary?: string;

  /**
   * Formats the address for presentation on a single line.
   */
  public toString(): string {
    return this.secondary ? `${this.primary}, ${this.secondary}` : this.primary;
  }
}
