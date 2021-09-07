import { DeviationType } from "..";

/**
 * Represents a image on a deviation
 */
export class DeviationImage
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: string)
  {
    this.data = data;
  }

  public data: string;
  public fileName?: string;
}

/**
 * Represents a deviation on a collection point order
 */
export class Deviation
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: any)
  {
    // FIXME: Construct it
    this.type = new DeviationType(data.type);
  }

  /**
   * The type of deviation
   */
  public type: DeviationType;

  /**
   * The description by the driver
   */
  public description?: string;

  /**
   * The images taken by the driver of the deviation
   */
  public images: DeviationImage[] = [];
}
