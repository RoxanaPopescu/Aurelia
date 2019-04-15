import React from "react";
import "./stops.scss";
import Stop from "./components/stop/stop";
import { RouteDetailsService } from "../../routeDetailsService";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RouteStop } from "shared/src/model/logistics/routes/details";

@observer
export default class extends React.Component<{ service: RouteDetailsService }> {
  public render() {
    
    const routeStops = this.props.service.routeDetails!.stops
      .filter(routeStop => routeStop instanceof RouteStop) as RouteStop[];

    return (
      <div className="c-routeDetails-stops c-routeDetails-section">
        <div className="c-routeDetails-section-heading font-heading">
          {Localization.sharedValue("RouteDetails_Stops_Heading", {
            visited: this.props.service.routeDetails!.visitedStopCount,
            total: this.props.service.routeDetails!.totalStopCount
          })}
        </div>

        <div className="c-routeDetails-stops-headers">
          <div>
            {Localization.sharedValue("RouteDetails_Stops_Headers_StopNumber")}
          </div>
          <div>
            {Localization.sharedValue(
              "RouteDetails_Stops_Headers_DeliveryAddress"
            )}
          </div>
          <div>
            {Localization.sharedValue("RouteDetails_Stops_Headers_ArrivalDate")}
          </div>
          <div>
            {Localization.sharedValue("RouteDetails_Stops_Headers_ArrivalTime")}
          </div>
          <div>
            {Localization.sharedValue("RouteDetails_Stops_Headers_TimeFrame")}
          </div>
          <div>
            {Localization.sharedValue("RouteDetails_Stops_Headers_LoadingTime")}
          </div>
        </div>

        <div>
          {routeStops.map(routeStop => (
            <Stop
              key={routeStop.id}
              routeStop={routeStop}
              nextRouteStop={routeStops[routeStops.indexOf(routeStop) + 1]}
            />
          ))}
        </div>
      </div>
    );
  }
}
