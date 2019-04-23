import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import { Vehicle } from "../../../../models/vehicle";
import "./vehicleList.scss";
import { Icon } from "shared/src/webKit";

export interface VehiclesProps {
  vehicles: ReadonlyArray<Vehicle> | undefined;
  onRemove: (vehicle: Vehicle) => void;
}

@observer
export class VehicleList extends React.Component<VehiclesProps> {

  public render() {
    return (
      <div className="c-driver-vehicleList">

        <div className="c-driver-vehicleList-headers">
          <div>{Localization.operationsValue("Driver_Vehicles_Type")}</div>
          <div>{Localization.operationsValue("Driver_Vehicles_LicensePlate")}</div>
          <div>{Localization.operationsValue("Driver_Vehicles_Make")}</div>
          <div>{Localization.operationsValue("Driver_Vehicles_Model")}</div>
          <div>{Localization.operationsValue("Driver_Vehicles_Color")}</div>
          <div>{Localization.operationsValue("Driver_Vehicles_Year")}</div>
          <div/>
        </div>

        {this.props.vehicles != null &&
         this.props.vehicles.length === 0 &&
          <div className="c-driver-vehicleList-noVehiclesMessage">
            {Localization.operationsValue("Driver_Vehicles_NoVehiclesMessage")}
          </div>}

        {this.props.vehicles != null &&
         this.props.vehicles.map(v =>
          this.renderVehicle(v))}

      </div>
    );
  }

  private renderVehicle(vehicle: Vehicle) {
    return (
      <div className="c-driver-vehicleList-vehicle" key={vehicle.id}>
        <div>{VehicleType.get(vehicle.type).name}</div>
        <div>{vehicle.licensePlate}</div>
        <div>{vehicle.make}</div>
        <div>{vehicle.model}</div>
        <div>{vehicle.color}</div>
        <div>{vehicle.year}</div>
        <div onClick={() => this.props.onRemove(vehicle)}>
          <Icon name="delete"/>
        </div>
      </div>
    );
  }
}
