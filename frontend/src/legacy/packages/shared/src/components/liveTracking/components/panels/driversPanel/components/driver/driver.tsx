import React from "react";
import { observer } from "mobx-react";
import { Driver } from "app/model/driver";
import { Route } from "shared/src/model/logistics/routes/tracking";
import Localization from "shared/src/localization";
import { Distance } from "shared/src/utillity/distance";

export interface DriverInfoProps {
  driver: Driver;
  route: Route;
  selected: boolean;
  onClick: () => void;
}

@observer
export class DriverComponent extends React.Component<DriverInfoProps> {

  public render() {
    let distanceInMeters = Distance.distanceBetweenCoordinates(this.props.driver.position, this.props.route.stops[0].location.position);

    return (
      <div
        key={this.props.driver.id}
        onClick={() => this.props.onClick()}
        className={`
          c-liveTracking-splitRoutePanel-driver
          ${this.props.selected ? "c-liveTracking-splitRoutePanel-driver--selected" : ""}`
        }
      >
        <div className="c-liveTracking-splitRoutePanel-driver-id">{this.props.driver.id}</div>
        <div className="c-liveTracking-splitRoutePanel-driver-name">{this.props.driver.name.toString()}</div>
        { distanceInMeters != null &&
          <div className="c-liveTracking-splitRoutePanel-driver-vehicleTypes">
            {"{distance} from route".replace("{distance}", Localization.formatDistance(distanceInMeters))}
          </div>
        }
      </div>
    );
  }
}
