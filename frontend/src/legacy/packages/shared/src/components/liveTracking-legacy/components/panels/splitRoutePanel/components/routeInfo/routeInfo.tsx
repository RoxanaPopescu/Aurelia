import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import {
  Route as RouteModel,
  RouteStop
} from "shared/src/model/logistics/routes/tracking";
import { DriverInfo } from "shared/src/components/liveTracking-legacy/services/routeSplitService";
import "./routeInfo.scss";

export interface RoutesLayerProps {
  route: RouteModel;
  selectedVehicleType: VehicleType | undefined;
  selectedDriverInfo: DriverInfo | undefined;
  selectedStops: RouteStop[];
}

@observer
export class RouteInfo extends React.Component<RoutesLayerProps> {
  public render() {
    const selectedStopNumbers = this.props.selectedStops.map(s => s.stopNumber);

    return (
      <div className="c-liveTracking-splitRoutePanel-routeInfo">
        <div className="c-liveTracking-routesPanel-route">
          <div className="c-liveTracking-routesPanel-route-picture">
            {(this.props.selectedDriverInfo &&
              this.props.selectedDriverInfo.driver.pictureUrl && (
                <img src={this.props.selectedDriverInfo.driver.pictureUrl} />
              )) || (
              <img
                src={require("../../../../../../../assets/images/avatar.png")}
              />
            )}
          </div>

          <div>
            <div className="c-liveTracking-panel-section">
              <div className="c-liveTracking-panel-title c-liveTracking-routesPanel-route-title">
                <div>
                  {Localization.sharedValue("LiveTracking_NewRoute_Title", {
                    stops: Localization.formatIntegersAsRanges(
                      selectedStopNumbers
                    )
                  })}
                </div>
              </div>

              {this.props.selectedDriverInfo && (
                <div className="c-liveTracking-routesPanel-route-info">
                  <div>
                    {this.props.selectedDriverInfo.driver.name.toString()}
                  </div>

                  <div>
                    {this.props.selectedDriverInfo.driver.phone.toString()}
                  </div>

                  {this.props.selectedVehicleType && (
                    <div>{this.props.selectedVehicleType.name}</div>
                  )}
                </div>
              )}

              {!this.props.selectedDriverInfo && (
                <div className="c-liveTracking-routesPanel-route-info">
                  <div>
                    {Localization.sharedValue(
                      "LiveTracking_NewRoute_ChooseVehicleAndDriverHint"
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
