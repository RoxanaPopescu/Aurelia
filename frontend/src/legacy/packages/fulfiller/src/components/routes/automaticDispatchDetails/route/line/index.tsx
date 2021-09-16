import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Duration } from "luxon";
import { RoutePlanningStore } from "../../store";

interface Props {
  data: LineData[];
  color: string;
  store: RoutePlanningStore;
}

export interface LineData {
  duration: Duration;
  dotted: boolean;
}

@observer
export default class RoutePlanningRoutesLineComponent extends React.Component<
  Props
> {
  renderLine(data: LineData) {
    let border = data.dotted ? "1px dashed " : "1px solid ";
    let title = data.dotted
      ? Localization.operationsValue(
          "RoutePlanning_RoutePlan_Route_Stop_WaitingTime"
        )
      : Localization.operationsValue(
          "RoutePlanning_RoutePlan_Route_Stop_DrivingTime"
        );
    let minutes = data.duration.as("minutes");

    return (
      <div
        key={"single_line_" + minutes}
        style={{
          border: border + this.props.color,
          width: this.props.store.minutesToPixels(minutes) + "px"
        }}
        title={title.replace(
          "{time}",
          Localization.formatDuration(data.duration)
        )}
      />
    );
  }

  render() {
    return (
      <div className="c-routePlanning-routes-route-line">
        {this.props.data.map(line => this.renderLine(line))}
      </div>
    );
  }
}
