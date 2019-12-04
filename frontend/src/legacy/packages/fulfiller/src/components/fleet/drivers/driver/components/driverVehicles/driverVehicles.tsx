import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import {
  LoadingOverlay,
  Button,
  ButtonType,
  Divider,
  ButtonSize
} from "shared/src/webKit";
import { DriverService } from "../../services/driverService";
import { VehicleService } from "../../services/vehicleService";
import { Vehicle } from "../../models/vehicle";
import { VehicleList } from "./components/vehicleList/vehicleList";
import { VehicleForm } from "./components/vehicleForm/vehicleForm";
import "./driverVehicles.scss";
import { Log } from "shared/infrastructure";
import { Profile } from "shared/src/model/profile";

export interface DriverProfileProps {
  vehicleService: VehicleService;
  driverService: DriverService;
}

@observer
export class DriverVehicles extends React.Component<DriverProfileProps> {
  public constructor(props: DriverProfileProps) {
    super(props);

    this.newVehicle = new Vehicle();
  }

  @observable
  private validate = false;

  @observable
  private newVehicle: Vehicle;

  public render() {
    return (
      <>
        {this.props.vehicleService.busy && (
          <LoadingOverlay fade={this.props.vehicleService.vehicles != null} />
        )}

        <div className="c-driver-tab c-driver-driverVehicles">
          <div className="font-large">
            {Localization.operationsValue("Driver_Vehicles_ListTitle")}
          </div>

          <VehicleList
            vehicles={this.props.vehicleService.vehicles}
            onRemove={vehicle => this.onRemoveVehicle(vehicle)}
          />

          {Profile.claims.has("create-vehicle") &&
          <>
            <Divider />

            <div className="font-large">
              {Localization.operationsValue("Driver_Vehicles_AddVehicleTitle")}
            </div>

            <VehicleForm validate={this.validate} vehicle={this.newVehicle} />

            <div className="c-driver-driverVehicles-actions">
              <Button
                size={ButtonSize.Medium}
                type={ButtonType.Action}
                disabled={!this.newVehicle.isValid}
                onClick={() => this.onAddVehicle(this.newVehicle)}
              >
                {Localization.operationsValue("Driver_Vehicles_AddVehicle")}
              </Button>
            </div>
          </>}
        </div>
      </>
    );
  }

  private onAddVehicle(vehicle: Vehicle): void {
    try {
      this.props.vehicleService.addVehicle(
        vehicle,
        this.props.driverService.driver!.id!
      );
      this.newVehicle = new Vehicle({});
      this.validate = false;
    } catch (error) {
      this.validate = true;
      Log.error(Localization.operationsValue("Driver_Vehicles_CouldNotAddVehicle"), error);
    }
  }

  private onRemoveVehicle(vehicle: Vehicle): void {
    try {
      this.props.vehicleService.removeVehicle(
        vehicle,
        this.props.driverService.driver!.id!
      );
    } catch (error) {
      Log.error(Localization.operationsValue("Driver_Vehicles_CouldNotRemoveVehicle"), error);
    }
  }
}
