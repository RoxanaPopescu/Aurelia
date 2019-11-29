import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { LoadingOverlay, Button, ButtonType, ButtonSize, Input } from "shared/src/webKit";
import { DriverService } from "../../services/driverService";
import { Driver } from "../../models/driver";
import { DriverForm } from "./components/driverForm/driverForm";
import H from "history";
import "./driverProfile.scss";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { Dialog } from "shared/src/components/dialog/dialog";
import { Log } from "shared/infrastructure";
import { Profile } from "shared/src/model/profile";

export interface DriverProfileProps {
  history: H.History;
  driverService: DriverService;
  onDriverAdded: (driver: Driver) => void;
}

@observer
export class DriverProfile extends React.Component<DriverProfileProps> {

  @observable
  private validate = false;

  @observable
  private changePassword = false;

  @observable
  private newPassword: string | undefined;

  public render() {
    const passwordMinLength = 6;
    return (
      <>

        {this.props.driverService.busy &&
          <LoadingOverlay fade={this.props.driverService.driver != null}/>}

        {this.props.driverService.driver != null &&
        <div className="c-driver-tab c-driver-driverProfile">

          <DriverForm validate={this.validate} driver={this.props.driverService.driver}/>

          {Profile.claims.has("edit-driver") &&
          <>
            <Button
              size={ButtonSize.Medium}
              type={ButtonType.Action}
              disabled={!this.props.driverService.driver.isValid}
              onClick={() => this.onSaveDriver()}
            >
              {this.props.driverService.driver.id != null ?
                Localization.operationsValue("Driver_Profile_SaveChanges") :
                Localization.operationsValue("Driver_Profile_AddDriver")}
            </Button>

            <Button
              size={ButtonSize.Medium}
              type={ButtonType.Light}
              onClick={() => this.onChangePassword()}
            >
              {Localization.operationsValue("Driver_Profile_ChangePassword")}
            </Button>

            {this.props.driverService.driver.id != null &&
            <Button
              size={ButtonSize.Medium}
              type={ButtonType.Light}
              onClick={() => this.onDeleteDriver()}
            >
              {Localization.operationsValue("Driver_Profile_DeleteDriver")}
            </Button>}
          </>}

        </div>}

        {this.changePassword && (
          <Dialog
            title={"Skift password"}
            onClose={() =>
            {
              this.newPassword = undefined;
              this.changePassword = false
            }}
          >
            <div className="c-driver-changePasswordForm">
              <Input
                size={"medium"}
                headline={Localization.operationsValue("Driver_Profile_Password")}
                placeholder={Localization.operationsValue("Driver_Profile_PasswordPlaceholder")}
                onChange={value => this.newPassword = value}
                error={this.newPassword != null && this.newPassword.trim().length < passwordMinLength}
                value={this.newPassword}
              />
            </div>

            <Button
              disabled={!this.newPassword || this.newPassword.trim().length < passwordMinLength}
              size={ButtonSize.Medium}
              type={ButtonType.Action}
              onClick={(x) => this.setPassword(this.newPassword!.trim())}
            >
              {Localization.operationsValue("Driver_Profile_SetPassword")}
            </Button>
          </Dialog>
        )}

      </>
    );
  }

  private async onSaveDriver() {
    try {
      const isNewDriver = this.props.driverService.driver.id == null;
      await this.props.driverService.saveDriver();
      if (isNewDriver) {
        this.props.onDriverAdded(this.props.driverService.driver);
      }
      this.validate = true;
    } catch (error) {
      this.validate = true;
      Log.error(Localization.operationsValue("Driver_Profile_CouldNotSaveDriver"), error);
    }
  }

  private async onDeleteDriver() {
    if (!confirm(Localization.operationsValue("Driver_Profile_ConfirmDeleteDriver"))) {
      return;
    }
    try {
      await this.props.driverService.deleteDriver();
      this.props.history.push(FulfillerSubPage.path(FulfillerSubPage.DriverList));
    } catch (error) {
      Log.error(Localization.operationsValue("Driver_Profile_CouldNotDeleteDriver"), error);
    }
  }

  private async onChangePassword() {
    this.changePassword = true;
  }

  private async setPassword(newPassword: string) {
    try {
      await this.props.driverService.setPassword(newPassword);
    } catch (error) {
      Log.error(Localization.operationsValue("Driver_Profile_CouldNotSetPassword"), error);
    }
    this.newPassword = undefined;
    this.changePassword = false;
  }
}
