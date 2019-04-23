import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import {
  Select,
  LoadingOverlay,
  Button,
  ButtonType,
  InputCheckbox,
  InputTextarea,
  Input,
  DividerComponent,
  Toast,
  ToastType,
  ButtonSize
} from "shared/src/webKit";
import { CommunicationService } from "./services/communicationService";
import "./index.scss";
import { CommunicationSettings } from "./services/models/communicationSettings";
import { observable } from "mobx";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

@observer
export default class CommunicationConsignorComponent extends React.Component {

  private service = new CommunicationService();
  @observable private error: Error | undefined;
  @observable private success = false;

  // tslint:disable-next-line:no-any
  public constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue(
      "Communication_Consignor_Title"
    );
  }

  public componentWillMount() {
    try {
      this.service.loadConsignors();
    } catch (error) {
      this.error = error;
    }
  }

  public render() {

    return (
      <React.Fragment>

        <PageHeaderComponent
          path={[
            { title: Localization.operationsValue("Communication_Consignor_Title") }
          ]}
        >

            {this.service.settings != null && !this.service.busy &&
            <Button
              type={ButtonType.Action}
              size={ButtonSize.Medium}
              disabled={!this.service.settings.isValid}
              onClick={async () => {
                await this.onSaveChanges();
                this.success = true;
              }}
            >
              {Localization.sharedValue("SaveChanges")}
            </Button>}

        </PageHeaderComponent>

        <PageContentComponent className="c-communication-consignor">
        
          {this.renderContent()}

        </PageContentComponent>

      </React.Fragment>
    );
  }

  public renderContent() {
    return (
      <div className="c-communication">
        <div className="c-communication-section">
          <Select
            className="c-communication-section-input"
            size="medium"
            headline={Localization.operationsValue(
              "Communication_Consignor_ChooseConsignor_Headline"
            )}
            placeholder={Localization.operationsValue(
              "Communication_Consignor_ChooseConsignor_Placeholder"
            )}
            disabled={this.service.consignors === undefined}
            options={
              this.service.consignors
                ? this.service.consignors!.map(c => ({
                    value: c.id,
                    label: c.companyName!
                  }))
                : []
            }
            value={this.service.consignorId}
            onSelect={option =>
              this.onConsignorChanged(option ? option.value : undefined)
            }
          />
        </div>

        <DividerComponent />

        {this.service.settings && (
          <div className="c-communication-section">
            <Input
              className="c-communication-section-input"
              headline={Localization.operationsValue(
                "Communication_Consignor_SenderName_Headline"
              )}
              placeholder={Localization.operationsValue(
                "Communication_Consignor_SenderName_Placeholder"
              )}
              size="medium"
              maxlength={11}
              value={this.service.settings.senderName}
              onChange={value => (this.service.settings!.senderName = value)}
            />

            {this.service.settings && (
              <React.Fragment>
                {this.renderRouteStartForm(this.service.settings)}
                {this.renderEstimatedDeliveryForm(this.service.settings)}
                {this.renderDelayedDeliveryForm(this.service.settings)}
                {this.renderDeliveredForm(this.service.settings)}
              </React.Fragment>
            )}

          </div>
        )}
        {this.service.busy && (
          <div className="c-communication-loading">
            <LoadingOverlay fade={this.service.settings != null} />
          </div>
        )}
        {this.error && (
          <Toast type={ToastType.Alert} remove={() => (this.error = undefined)}>
            {this.error.message}
          </Toast>
        )}
        {this.success && (
          <Toast type={ToastType.Success} remove={() => (this.success = false)}>
            {Localization.operationsValue("Communication_Consignor_Saved")}
          </Toast>
        )}
      </div>
    );
  }

  private async onConsignorChanged(consignorId: string) {
    try {
      await this.service.loadSettings(consignorId);
    } catch (error) {
      this.error = error;
    }
  }

  private async onSaveChanges() {
    try {
      await this.service.saveSettings();
    } catch (error) {
      this.error = error;
    }
  }

  private renderRouteStartForm(settings: CommunicationSettings) {
    return (
      <div className="c-communication-event">
        <div className="font-large">
          <InputCheckbox
            checked={settings.routeStarted.isActive}
            onChange={value => (settings.routeStarted.isActive = value)}
          >
            {Localization.operationsValue(
              "Communication_Consignor_Event_Start_Title"
            )}
          </InputCheckbox>
        </div>

        {settings.routeStarted.isActive && (
          <div className="c-communication-form">
            <p
              dangerouslySetInnerHTML={{
                __html: Localization.operationsValue(
                  "Communication_Consignor_Event_Start_Help"
                )
              }}
            />

            <InputTextarea
              headline={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              placeholder={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              rows={3}
              size="medium"
              error={
                settings.routeStarted.messageTemplate != null &&
                /^\s+$/.test(settings.routeStarted.messageTemplate!)
              }
              value={settings.routeStarted.messageTemplate}
              onChange={value =>
                (settings.routeStarted.messageTemplate = value || "")
              }
            />
          </div>
        )}
      </div>
    );
  }

  private renderEstimatedDeliveryForm(settings: CommunicationSettings) {
    return (
      <div className="c-communication-event">
        <div className="font-large">
          <InputCheckbox
            checked={settings.notifyDeliveryTime.isActive}
            onChange={value => (settings.notifyDeliveryTime.isActive = value)}
          >
            {Localization.operationsValue(
              "Communication_Consignor_Event_Delivery_Title"
            )}
          </InputCheckbox>
        </div>

        {settings.notifyDeliveryTime.isActive && (
          <div className="c-communication-form">
            <p
              dangerouslySetInnerHTML={{
                __html: Localization.operationsValue(
                  "Communication_Consignor_Event_Delivery_Help"
                )
              }}
            />

            <InputTextarea
              headline={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              placeholder={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              rows={3}
              size="medium"
              error={
                settings.notifyDeliveryTime.messageTemplate != null &&
                /^\s+$/.test(settings.notifyDeliveryTime.messageTemplate!)
              }
              value={settings.notifyDeliveryTime.messageTemplate}
              onChange={value =>
                (settings.notifyDeliveryTime.messageTemplate = value || "")
              }
            />

            <div className="c-communication-form-row">
              <Input
                headline={Localization.operationsValue(
                  "Communication_Consignor_Event_Delivery_TimeBefore"
                )}
                valueDescription={Localization.sharedValue("Minutes")}
                type="number"
                size="medium"
                error={settings.notifyDeliveryTime.timeBeforeDeliveryToSend < 0}
                value={settings.notifyDeliveryTime.timeBeforeDeliveryToSend.toString()}
                onChange={value =>
                  (settings.notifyDeliveryTime.timeBeforeDeliveryToSend = value || 0)
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  private renderDelayedDeliveryForm(settings: CommunicationSettings) {
    return (
      <div className="c-communication-event">
        <div className="font-large">
          <InputCheckbox
            checked={settings.notifyDeliveryDelay.isActive}
            onChange={value => (settings.notifyDeliveryDelay.isActive = value)}
          >
            {Localization.operationsValue(
              "Communication_Consignor_Event_Delay_Title"
            )}
          </InputCheckbox>
        </div>

        {settings.notifyDeliveryDelay.isActive && (
          <div className="c-communication-form">
            <p
              dangerouslySetInnerHTML={{
                __html: Localization.operationsValue(
                  "Communication_Consignor_Event_Delay_Help"
                )
              }}
            />

            <InputTextarea
              headline={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              placeholder={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              rows={3}
              size="medium"
              error={
                settings.notifyDeliveryDelay.messageTemplate != null &&
                /^\s+$/.test(settings.notifyDeliveryDelay.messageTemplate!)
              }
              value={settings.notifyDeliveryDelay.messageTemplate}
              onChange={value =>
                (settings.notifyDeliveryDelay.messageTemplate = value || "")
              }
            />

            <div className="c-communication-form-row">
              <Input
                headline={Localization.operationsValue(
                  "Communication_Consignor_Event_Delay_DelayThreshold"
                )}
                valueDescription={Localization.sharedValue("Minutes")}
                type="number"
                size="medium"
                error={settings.notifyDeliveryDelay.estimatePadding < 1}
                value={settings.notifyDeliveryDelay.estimatePadding.toString()}
                onChange={value =>
                  (settings.notifyDeliveryDelay.estimatePadding = value || 0)
                }
              />

              <Input
                headline={Localization.operationsValue(
                  "Communication_Consignor_Event_Delay_TimeBefore"
                )}
                valueDescription={Localization.sharedValue("Minutes")}
                type="number"
                size="medium"
                error={
                  settings.notifyDeliveryDelay.timeBeforeDeliveryToSend < 0
                }
                value={settings.notifyDeliveryDelay.timeBeforeDeliveryToSend.toString()}
                onChange={value =>
                  (settings.notifyDeliveryDelay.timeBeforeDeliveryToSend = value || 0)
                }
              />

              <Input
                headline={Localization.operationsValue(
                  "Communication_Consignor_Event_Delay_TimeToAdd"
                )}
                valueDescription={Localization.sharedValue("Minutes")}
                type="number"
                size="medium"
                error={settings.notifyDeliveryDelay.delayBeforeSending < 0}
                value={settings.notifyDeliveryDelay.delayBeforeSending.toString()}
                onChange={value =>
                  (settings.notifyDeliveryDelay.delayBeforeSending = value || 0)
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  private renderDeliveredForm(settings: CommunicationSettings) {
    return (
      <div className="c-communication-event">
        <div className="font-large">
          <InputCheckbox
            checked={settings.orderDelivered.isActive}
            onChange={value => (settings.orderDelivered.isActive = value)}
          >
            {Localization.operationsValue(
              "Communication_Consignor_Event_Delivered_Title"
            )}
          </InputCheckbox>
        </div>

        {settings.orderDelivered.isActive && (
          <div className="c-communication-form">
            <p
              dangerouslySetInnerHTML={{
                __html: Localization.operationsValue(
                  "Communication_Consignor_Event_Delivered_Help"
                )
              }}
            />

            <InputTextarea
              headline={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              placeholder={Localization.operationsValue(
                "Communication_Consignor_Input_Message"
              )}
              rows={3}
              size="medium"
              error={
                settings.orderDelivered.messageTemplate != null &&
                /^\s+$/.test(settings.orderDelivered.messageTemplate!)
              }
              value={settings.orderDelivered.messageTemplate}
              onChange={value =>
                (settings.orderDelivered.messageTemplate = value || "")
              }
            />
          </div>
        )}
      </div>
    );
  }
}
