import { observable } from "mobx";

/**
 * Represents the loading times to be taken into account when planning a route.
 */
export class LoadingTimes {
  // tslint:disable-next-line:no-any
  constructor(data: any = undefined) {
    if (data) {
      this.pickupLoadingTime = data.pickupLoadingTime;
      this.timeForParking = data.timeForParking;
      this.timePerFloor = data.timePerFloor;
      this.timePerDeliveryRound = data.timePerDeliveryRound;
      this.colliCountPerDeliveryRound = data.colliCountPerDeliveryRound;
    }
  }

  /**
   * How long it takes to complete pickup loading (in seconds)
   */
  @observable
  public pickupLoadingTime?: number;

  /**
   * How long it takes to find parking (in seconds)
   */
  @observable
  public timeForParking?: number;

  /**
   * How long it takes for each floor (in seconds)
   */
  @observable
  public timePerFloor?: number;

  /**
   * How long it takes for each complete delivery (in seconds)
   */
  @observable
  public timePerDeliveryRound?: number;

  /**
   * The amount of colli for each delivery
   */
  @observable
  public colliCountPerDeliveryRound?: number;

  public validate(): boolean {
    if (
      !this.pickupLoadingTime ||
      !this.timeForParking ||
      !this.timePerFloor ||
      !this.timePerDeliveryRound ||
      !this.colliCountPerDeliveryRound
    ) {
      return false;
    }

    return true;
  }
}
