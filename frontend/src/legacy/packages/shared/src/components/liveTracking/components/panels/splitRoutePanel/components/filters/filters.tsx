import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import { Input, Select } from "shared/src/webKit";
import "./filters.scss";

export interface RoutesLayerProps {
  vehicleType: VehicleType | undefined;
  textFilter: string | undefined;
  onVehicleTypeChange: (vehicleType: VehicleType) => void;
  onTextFilterChange: (textFilter: string) => void;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {

  private vehicleTypeOptions = VehicleType.getAll()
    .map(vehicleType => ({ label: vehicleType.name, value: vehicleType }));

  public render() {
    return (
      <div className="c-liveTracking-splitRoutePanel-filters">

        <Select
          placeholder={Localization.sharedValue("LiveTracking_NewRoute_VehicleTypePlaceholder")}
          options={this.vehicleTypeOptions}
          value={this.props.vehicleType}
          onSelect={option => this.props.onVehicleTypeChange(option ? option.value : undefined)}
        />

        <Input
          type="search"
          placeholder={Localization.sharedValue("Input_Placeholder_Filter")}
          value={this.props.textFilter}
          onChange={value => this.props.onTextFilterChange(value)}
        />
        
      </div>
    );
  }
}
