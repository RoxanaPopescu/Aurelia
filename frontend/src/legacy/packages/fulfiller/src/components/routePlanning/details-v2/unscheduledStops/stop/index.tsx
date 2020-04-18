import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { RoutePlanUnscheduledTask } from "shared/src/model/logistics/routePlanning";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";

interface Props {
  task: RoutePlanUnscheduledTask;
  store: RoutePlanningStore;
}
@observer
export default class RoutePlanningRoutesStopComponent extends React.Component<
  Props
> {
  onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("type", "UnscheduledTask");
    e.dataTransfer.setData("index", String(this.props.task.taskNumber - 1));
  }

  render() {
    const stop = this.props.task.delivery;

    return (
      <div
        className="c-routePlanning-unscheduledStop"
        onClick={() => {
          this.props.store.zoomToCoordinate(
            stop.location.position!.toGoogleLatLng()
          );
          this.props.store.focusRoute(undefined);
        }}
        title={this.props.task.reasons.join(", ")}
        draggable={true}
        onDragStart={e => this.onDragStart(e)}
      >
        <RoutePlanningRoutesStopItemComponent
          title={Localization.sharedValue("Timeframe")}
          description={Localization.formatTimeRange(stop.arrivalTimeFrame)}
        />
        <RoutePlanningRoutesStopItemComponent
          title={Localization.sharedValue("Address")}
          description={stop.location.address.primary}
        />
        <img src={require("./assets/drag.svg")} />
      </div>
    );
  }
}

interface ItemProps {
  title: string;
  description: string;
}

class RoutePlanningRoutesStopItemComponent extends React.Component<ItemProps> {
  render() {
    return (
      <div className="c-routePlanning-unscheduledStop-item">
        <div className="c-routePlanning-unscheduledStop-itemTitle font-small">
          {this.props.title}
        </div>
        <div className="c-routePlanning-unscheduledStop-itemDescription font-small">
          {this.props.description}
        </div>
      </div>
    );
  }
}
