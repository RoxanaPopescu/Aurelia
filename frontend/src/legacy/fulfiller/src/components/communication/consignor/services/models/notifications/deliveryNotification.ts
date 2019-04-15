import { observable, computed } from "mobx";

/**
 * The settings for the notification to send before the delivery is made.
 */
export class DeliveryNotificationSettings {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    if (data) {
      this.isActive = data.isActive;
      this.messageTemplate = data.messageTemplate;
      this.timeBeforeDeliveryToSend = data.timeBeforeDeliveryToSend;
      this.estimatePadding = data.estimatePadding;
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
   * The number of minutes before delivery, where the notification should be sent.
   */
  @observable
  public timeBeforeDeliveryToSend: number = 0;

  @observable
  public estimatePadding: number = 0;

  /**
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return (
      !this.isActive ||
      (this.messageTemplate !== undefined && this.timeBeforeDeliveryToSend > 0)
    );
  }
}
