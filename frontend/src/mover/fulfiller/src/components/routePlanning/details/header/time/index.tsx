import React from "react";
import "./styles.scss";
import { Duration } from "luxon";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../../store";

interface Props {
  store: RoutePlanningStore;
}

@observer
export default class TimeHeaderComponent extends React.Component<Props> {
  renderContent() {
    if (!this.props.store.map) {
      return;
    }

    const meta = this.props.store.plan.meta;
    const fromMinute = meta.timeFrame.from!.minute;
    const maxMinutes = 20;
    const minMinutes = 10;

    let components: JSX.Element[] = [];
    let times: Duration[] = [];

    if (fromMinute > 60 - maxMinutes) {
      let minutes = 60 - fromMinute + 60;
      times.push(Duration.fromObject({ minutes: minutes }));
    } else {
      let minutes = 60 - fromMinute;
      times.push(Duration.fromObject({ minutes: minutes }));
    }

    let remainingDuration = meta.timeFrame.duration.minus(times[0]);
    let remainingHours = Math.floor(remainingDuration.as("hours"));
    const remainingMinutes = remainingDuration
      .minus(Duration.fromObject({ hours: remainingHours }))
      .as("minutes");

    if (remainingMinutes <= minMinutes && fromMinute !== 0) {
      remainingHours--;
    }

    for (let i = 0; i < remainingHours; i++) {
      times.push(Duration.fromObject({ minutes: 60 }));
    }

    if (remainingMinutes <= minMinutes) {
      times.push(Duration.fromObject({ minutes: 60 + remainingMinutes }));
    } else {
      times.push(Duration.fromObject({ minutes: remainingMinutes }));
    }

    // Add last one with no width. This will render the last time
    times.push(Duration.fromObject({ minutes: 0 }));

    let current = meta.timeFrame.from!;
    for (let time of times) {
      let formattedDate = Localization.formatTime(current);
      components.push(
        <div
          key={formattedDate}
          style={{
            width: this.props.store.minutesToPixels(time.as("minutes")) + "px"
          }}
        >
          <div className="c-routePlanning-routes-list-headerContent-date">
            {formattedDate}
          </div>
        </div>
      );

      current = current.plus(time);
    }

    return components;
  }

  render() {
    return (
      <div className="c-routePlanning-routes-list-headerContentContainer">
        <div className="c-routePlanning-routes-list-headerContent c-routePlanning-routes-list-headerContentTime">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
