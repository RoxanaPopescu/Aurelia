import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";

interface Props {
  store: RoutePlanningStore;
}

@observer
export default class RoutePlanningTimeDividerComponent extends React.Component<
  Props
> {
  render() {
    let lines: JSX.Element[] = [];
    let totalMinutes = this.props.store.plan.meta.timeFrame.duration.as(
      "minutes"
    );
    let divisions = Math.min(Math.ceil(totalMinutes / 30), 200);
    let minutes = 0;
    for (let i = 0; i < divisions; i++) {
      lines.push(
        <div
          key={"timeDividerVertical_" + minutes}
          className="c-routePlanning-routes-dividerVertical"
          style={{
            left: 30 + this.props.store.minutesToPixels(minutes) + "px"
          }}
        />
      );
      minutes += 30;
    }

    for (let i = 1; i <= this.props.store.plan.routes.length - 1; i++) {
      lines.push(
        <div
          key={"timeDividerHorizontal_" + minutes * i}
          className="c-routePlanning-routes-dividerHorizontal"
          style={{
            top: 27 + i * 48 + "px",
            width: 30 + this.props.store.minutesToPixels(totalMinutes) + "px"
          }}
        />
      );
    }

    return <React.Fragment>{lines}</React.Fragment>;
  }
}
