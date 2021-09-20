import React from "react";
import "./styles.scss";
import Stop from "./stop";
import Line from "./line";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../store";
import { RouteBase, RouteStop } from "app/model/route";

interface Props {
  route: RouteBase;
  store: RoutePlanningStore;
}

interface State {
  draggedOver: Boolean;
}

@observer
export default class RoutePlanningRouteComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = { draggedOver: false };
  }

  renderComponents() {
    let components: JSX.Element[] = [];
    const route = this.props.route;
    const stops = route.stops;

    const firstStop = route.stops[0] as RouteStop;
    const firstStopTimeFrame = firstStop.estimates!.timeFrame;

    const durationFromEarliestMinutes = firstStopTimeFrame
      .from!.diff(this.props.store.timeFrame.from!)
      .as("minutes");

    // Draw empty div with correct width if later than earliest
    if (durationFromEarliestMinutes > 0) {
      components.push(
        <div
          style={{
            width:
              this.props.store.minutesToPixels(durationFromEarliestMinutes) +
              "px"
          }}
          key={"route_empty_first" + this.props.route.id}
        />
      );
    }

    /**
     * For each stop we draw in the following order
     * 1. Arrival time
     * 2. Waiting time
     * 3. Task time (loading time)
     */

    var currentDate = firstStopTimeFrame.from!;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i] as RouteStop;

      const difference = stop.estimates!.timeFrame
        .from!.diff(currentDate, "seconds")
        .as("minutes");

      if (difference !== 0) {
        const width = this.props.store.minutesToPixels(difference);
        components.push(
          <div
            style={{
              width: width + "px"
            }}
            key={"stop_spacer" + stop.id + this.props.route.id}
          />
        );
      }

      if (stop.estimates!.waitingTime != null)
      {
        currentDate = currentDate.plus(stop.estimates!.waitingTime);
      }

      if (stop.estimates!.drivingTime != null)
      {
        currentDate = currentDate.plus(stop.estimates!.drivingTime);
      }

      if (stop.estimates!.taskTime != null)
      {
        currentDate = currentDate.plus(stop.estimates!.taskTime);
      }

      // Draw driving if it exists
      const drivingTimeInMinutes = stop.estimates!.drivingTime!.as("minutes");
      if (drivingTimeInMinutes > 0) {
        components.push(
          <Line
            store={this.props.store}
            color={(this.props.route as any).color}
            data={[
              {
                duration: stop.estimates!.drivingTime!,
                dotted: false
              }
            ]}
            key={"stop_line_" + stop.id + this.props.route.id}
          />
        );
      }

      // Show how long the driver is waiting
      if (stop.estimates!.waitingTime != null && stop.estimates!.waitingTime.as("minutes") > 0) {

        components.push(
          <Line
            store={this.props.store}
            color={(this.props.route as any).color}
            data={[
              {
                duration: stop.estimates!.waitingTime,
                dotted: true
              }
            ]}
            key={"stop_line_dotted_" + stop.id + this.props.route.id}
          />
        );
      }

      // Actual task time as a stop marker
      components.push(
        <Stop store={this.props.store} stop={stop} key={"stop_" + stop.id} />
      );
    }

    return components;
  }

  render() {
    let classNames = "c-routePlanning-routes-route-content";
    if (
      this.props.store.focusedRoute &&
      this.props.store.focusedRoute.id !== this.props.route.id
    ) {
      classNames += " c-routePlanning-routes-routeFaded";
    }

    if (this.state.draggedOver) {
      classNames += " c-routePlanning-routes-draggedOver";
    }

    return (
      <div className="c-routePlanning-routes-route">
        <div
          className={classNames}
        >
          {this.renderComponents()}
        </div>
      </div>
    );
  }
}
