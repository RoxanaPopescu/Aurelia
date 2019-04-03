import { observable, computed } from "mobx";

/**
 * The settings for the notification to send when the route starts.
 */
export class StartNotificationSettings {
  // tslint:disable-next-line:no-any
  public constructor(data: any) {
    if (data) {
      this.isActive = data.isActive;
      this.messageTemplate = data.messageTemplate;
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
   * True if the model is valid, otherwise false.
   */
  @computed
  public get isValid(): boolean {
    return !this.isActive || this.messageTemplate !== undefined;
  }
}
