import { ColloScanMethod } from "app/model/collo";
import { Accent, Dimensions } from "app/model/shared";

/**
 * Represents a collo on a collection point order
 */
export class Collo {
  /**
   * Barcode of the collo
   */
  barcode: string;

  /**
   * The weight of the collo in kg
   */
  weight?: number;

  /**
   * The Dimensions of the collo
   */
  dimensions?: Dimensions;

  /**
   * How the collo was verified by the driver
   */
  verificationMethod?: ColloScanMethod;

  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  constructor(json: any)
  {
    this.barcode = json.barcode;
    this.weight = json.weight;
    this.dimensions = json.dimensions
      ? new Dimensions(json.dimensions)
      : undefined;
  }

  accent(): Accent
  {
    if (this.verificationMethod == null)
    {
      return 'neutral';
    }

    if (this.verificationMethod.slug == 'scanned')
    {
      return 'positive';
    }
    else
    {
      return 'attention';
    }
  }
}
