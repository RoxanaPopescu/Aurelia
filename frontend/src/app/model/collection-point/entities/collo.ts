import { ColloScanMethod } from "app/model/collo";
import { Accent, Dimensions } from "app/model/shared";

/**
 * Represents a collo on a collection point order
 */
export class Collo
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: any)
  {
    this.barcode = data.barcode;
    this.weight = data.weight;
    this.dimensions = data.dimensions
      ? new Dimensions(data.dimensions)
      : undefined;
    this.verificationMethod = new ColloScanMethod(data.verificationMethod ? data.verificationMethod : "selected");
  }

  /**
   * Barcode of the collo
   */
  public barcode: string;

  /**
   * The weight of the collo in kg
   */
  public weight?: number;

  /**
   * The Dimensions of the collo
   */
  public dimensions?: Dimensions;

  /**
   * How the collo was verified by the driver
   */
  public verificationMethod: ColloScanMethod;

  public accent(): Accent
  {
    if (this.verificationMethod == null)
    {
      return "neutral";
    }

    if (this.verificationMethod.slug === "scanned")
    {
      return "positive";
    }

    return "attention";
  }

  /**
   * Gets the data representing this instance.
   */
  public toJSON(): any
  {
    return {
        barcode: this.barcode,
        verificationMethod: this.verificationMethod.slug
    };
  }
}
