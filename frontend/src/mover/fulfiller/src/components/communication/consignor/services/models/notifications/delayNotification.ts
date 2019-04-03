import { observable, computed } from "mobx";

/**
 * The settings for the notification to send when delivery is delayed.
 */
export class DelayNotificationSettings {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    if (data) {
      this.isActive = data.isActive;
      this.messageTemplate = data.messageTemplate;
      this.timeBeforeDeliveryToSend = data.timeBeforeDeliveryToSend;
      this.estimatePadding = data.estimatePadding;
      this.delayBeforeSending = data.delayBeforeSending;
    }
  }

  /**
   * True if the notification should be sent, otherwise false.
   */
  @observable
  public isActive = false;

  /**
   * The message text, or null to use the default message.
   */
  @observable
  public messageTemplate?: string;

  /**
   * The number of minutes before delivery, at which the notification may be sent, at the earliest.
   */
  @observable
  public timeBeforeDeliveryToSend = 0;

  /**
   * The number of minutes the delivery must be delayed, before the notification is sent.
   */
  @observable
  public estimatePadding = 0;

  /**
   * The number of minutes to add to the upper bound of the new estimate.
   */
  @observable
  public delayBeforeSending = 0;

  /**
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return (
      !this.isActive ||
      (this.messageTemplate !== undefined &&
        this.timeBeforeDeliveryToSend >= 0 &&
        this.estimatePadding > 0 &&
        this.delayBeforeSending >= 0)
    );
  }
}
