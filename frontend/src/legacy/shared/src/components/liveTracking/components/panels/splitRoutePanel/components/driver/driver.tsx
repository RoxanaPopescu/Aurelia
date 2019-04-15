import React from "react";
import { observer } from "mobx-react";
import { DriverInfo } from "shared/src/components/liveTracking/services/routeSplitService";
import "./driver.scss";

export interface DriverInfoProps {
  driverInfo: DriverInfo;
  selected: boolean;
  onClick: () => void;
}

@observer
export class Driver extends React.Component<DriverInfoProps> {

  public render() {
    return (
      <div
        key={this.props.driverInfo.driver.id}
        onClick={() => this.props.onClick()}
        className={`
          c-liveTracking-splitRoutePanel-driver
          ${this.props.selected ? "c-liveTracking-splitRoutePanel-driver--selected" : ""}`
        }
      >
        <div className="c-liveTracking-splitRoutePanel-driver-id">{this.props.driverInfo.driver.id}</div>
        <div className="c-liveTracking-splitRoutePanel-driver-name">{this.props.driverInfo.driver.name.toString()}</div>
        <div className="c-liveTracking-splitRoutePanel-driver-vehicleTypes">
          {this.props.driverInfo.vehicleTypes.map(vt => vt.name).join(", ")}
        </div>
      </div>
    );
  }
}
