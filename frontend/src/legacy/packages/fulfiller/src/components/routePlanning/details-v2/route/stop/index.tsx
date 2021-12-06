import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { RoutePlanRouteStop } from "shared/src/model/logistics/routePlanning";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";

interface Props {
  stop: RoutePlanRouteStop;
  store: RoutePlanningStore;
}

@observer
export default class RoutePlanningRoutesStopComponent extends React.Component<
  Props
> {
  onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("type", "Stop");
    e.dataTransfer.setData("index", String(this.props.stop.stopNumber - 1));
    e.dataTransfer.setData(
      "routeIndex",
      String(this.props.stop.route.routeNumber - 1)
    );
  }

  render() {
    const stop = this.props.stop;
    let width = this.props.store.minutesToPixels(
      stop.estimates.taskTime.as("minutes")
    );

    let classNames = "c-routePlanning-routes-route-stop";
    if (stop === this.props.store.focusedStop) {
      classNames += " c-routePlanning-routes-route-stop-selected";
    }

    let title: string;
    const duration = Localization.formatDuration(stop.estimates.taskTime);

    if (stop.type.slug === "break")
    {
      title = `${duration} ${Localization.sharedValue("Expected_BreakTime").toLowerCase()}`;
    }
    else
    {
      title = Localization.operationsValue(
        "RoutePlanning_RoutePlan_Route_Stop_TaskTime"
      ).replace(
        "{time}",
        duration
      )
    }

    return (
      <div
        className={classNames}
        onClick={() => this.props.store.focusStop(stop)}
        style={{
          backgroundColor: stop.route.color,
          borderColor: stop.route.color,
          width: width + "px"
        }}
        title={title}
      >
        <div className="font-small c-routePlanning-routes-route-stop-number">
          {((this.props.stop.stopNumber < 10 && width > 8) || width > 16) &&
            this.props.stop.stopNumber}
        </div>
      </div>
    );
  }
}
