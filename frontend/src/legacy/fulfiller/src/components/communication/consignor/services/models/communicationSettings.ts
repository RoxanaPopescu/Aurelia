import { observable, computed } from "mobx";
import { StartNotificationSettings } from "./notifications/startNotification";
import { DeliveryNotificationSettings } from "./notifications/deliveryNotification";
import { DelayNotificationSettings } from "./notifications/delayNotification";
import { DeliveredNotificationSettings } from "./notifications/deliveredNotification";

/**
 * The communication settings for a consignor.
 */
export class CommunicationSettings {
  // tslint:disable-next-line:no-any
  public constructor(data: any | undefined = undefined) {
    this.senderName = data ? data.senderName : "";
    this.consignorId = data ? data.consignorId : "";
    this.slug = data ? data.slug : "";

    this.routeStarted = new StartNotificationSettings(
      data ? data.routeStarted : undefined
    );
    this.notifyDeliveryTime = new DeliveryNotificationSettings(
      data ? data.notifyDeliveryTime : undefined
    );
    this.notifyDeliveryDelay = new DelayNotificationSettings(
      data ? data.notifyDeliveryDelay : undefined
    );
    this.orderDelivered = new DeliveredNotificationSettings(
      data ? data.orderDelivered : undefined
    );
  }

  /**
   * The id of the consignor
   */
  consignorId: string;

  /**
   * The id of the setting
   */
  slug: string;

  /**
   * The name of the sender, as it appears when users receive an SMS.
   */
  @observable
  public senderName: string;

  /**
   * The settings for the start notification.
   */
  @observable
  public routeStarted: StartNotificationSettings;

  /**
   * The settings for the delivery notification.
   */
  @observable
  public notifyDeliveryTime: DeliveryNotificationSettings;

  /**
   * The settings for the delay notification.
   */
  @observable
  public notifyDeliveryDelay: DelayNotificationSettings;

  /**
   * The settings for the delivered notification.
   */
  @observable
  public orderDelivered: DeliveredNotificationSettings;

  /**
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return (
      !!this.senderName &&
      this.routeStarted.isValid &&
      this.notifyDeliveryTime.isValid &&
      this.notifyDeliveryDelay.isValid &&
      this.orderDelivered.isValid
    );
  }
}
