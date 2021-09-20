import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";
import { RouteStop } from "app/model/route";

interface Props {
  stop: RouteStop;
  store: RoutePlanningStore;
}

@observer
export default class RoutePlanningRoutesStopComponent extends React.Component<
  Props
> {
  render() {
    const stop = this.props.stop;
    let width = this.props.store.minutesToPixels(
      stop.estimates!.taskTime!.as("minutes")
    );

    let classNames = "c-routePlanning-routes-route-stop";
    if (stop === this.props.store.focusedStop) {
      classNames += " c-routePlanning-routes-route-stop-selected";
    }

    return (
      <div
        className={classNames}
        onClick={() => this.props.store.focusStop(stop)}
        style={{
          backgroundColor: (stop.route as any).color,
          borderColor: (stop.route as any).color,
          width: width + "px"
        }}
        title={Localization.operationsValue(
          "RoutePlanning_RoutePlan_Route_Stop_TaskTime"
        ).replace(
          "{time}",
          Localization.formatDuration(stop.estimates?.taskTime)
        )}
      >
        <div className="font-small c-routePlanning-routes-route-stop-number">
          {((this.props.stop.stopNumber < 10 && width > 8) || width > 16) &&
            this.props.stop.stopNumber}
        </div>
      </div>
    );
  }
}
