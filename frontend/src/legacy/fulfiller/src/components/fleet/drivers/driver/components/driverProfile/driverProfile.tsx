import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { LoadingOverlay, Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { DriverService } from "../../services/driverService";
import { Driver } from "../../models/driver";
import { DriverForm } from "./components/driverForm/driverForm";
import H from "history";
import "./driverProfile.scss";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

export interface DriverProfileProps {
  history: H.History;
  driverService: DriverService;
  onDriverAdded: (driver: Driver) => void;
}

@observer
export class DriverProfile extends React.Component<DriverProfileProps> {

  @observable
  private validate = false;

  public render() {
    return (
      <>

        {this.props.driverService.busy &&
          <LoadingOverlay fade={this.props.driverService.driver != null}/>}

        {this.props.driverService.driver != null &&
        <div className="c-driver-tab c-driver-driverProfile">
        
          <DriverForm validate={this.validate} driver={this.props.driverService.driver}/>

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

          {this.props.driverService.driver.id != null &&
          <Button
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => this.onDeleteDriver()}
          >
            {Localization.operationsValue("Driver_Profile_DeleteDriver")}
          </Button>}

        </div>}

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
      alert(Localization.operationsValue("Driver_Profile_CouldNotSaveDriver"));
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
      alert(Localization.operationsValue("Driver_Profile_CouldNotDeleteDriver"));
    }
  }
}
