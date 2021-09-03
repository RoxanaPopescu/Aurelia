import { DeviationType } from "..";

/**
 * Represents a image on a deviation
 */
export class DeviationImage {
  data: string;
  fileName?: string;

  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  constructor(data: string)
  {
    this.data = data;
  }
}

/**
 * Represents a deviation on a collection point order
 */
export class Deviation
{
  /**
   * The type of deviation
   */
  type: DeviationType;

  /**
   * The description by the driver
   */
  description?: string;

  /**
   * The images taken by the driver of the deviation
   */
  images: DeviationImage[] = [];

  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  constructor(data: any) {
    // FIXME: Construct it
    this.type = new DeviationType(data.type);
  }
}
