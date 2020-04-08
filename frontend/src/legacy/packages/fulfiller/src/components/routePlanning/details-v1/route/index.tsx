import React from "react";
import "./styles.scss";
import {
  LegacyRoutePlanMeta,
  LegacyRoutePlanRoute
} from "shared/src/model/logistics/routePlanning";
import Stop from "./stop";
import Line from "./line";
import { observer } from "mobx-react";
import { RoutePlanningStore, DragType } from "../store";

interface Props {
  meta: LegacyRoutePlanMeta;
  route: LegacyRoutePlanRoute;
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

    const durationFromEarliestMinutes = route.meta.timeFrame
      .from!.diff(this.props.meta.timeFrame.from!)
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

    var currentDate = route.meta.timeFrame.from!;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];

      const difference = stop.estimates.timeFrame
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

      currentDate = currentDate.plus(
        stop.estimates.waitingTime
          .plus(stop.estimates.drivingTime)
          .plus(stop.estimates.loadingTime)
      );

      // Draw driving if it exists
      const drivingTimeInMinutes = stop.estimates.drivingTime.as("minutes");
      if (drivingTimeInMinutes > 0) {
        components.push(
          <Line
            store={this.props.store}
            color={this.props.route.color}
            data={[
              {
                duration: stop.estimates.drivingTime,
                dotted: false
              }
            ]}
            key={"stop_line_" + stop.id + this.props.route.id}
          />
        );
      }

      // Show how long the driver is waiting
      const waitingTimeInMinutes = stop.estimates.waitingTime.as("minutes");
      if (waitingTimeInMinutes > 0) {
        components.push(
          <Line
            store={this.props.store}
            color={this.props.route.color}
            data={[
              {
                duration: stop.estimates.waitingTime,
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

    // Draw empty div with correct width if not the last
    const durationFromLatestMinutes = route.meta.timeFrame
      .to!.diff(route.meta.timeFrame.to!)
      .as("minutes");

    // Draw empty div with correct width if later than earliest
    if (durationFromLatestMinutes > 0) {
      components.push(
        <div
          style={{
            width:
              this.props.store.minutesToPixels(durationFromLatestMinutes) + "px"
          }}
          key={"route_empty_last" + this.props.route.id}
        />
      );
    }

    return components;
  }

  onDrop(e: React.DragEvent<HTMLDivElement>) {
    this.setState({ draggedOver: false });

    const route = this.props.route;
    const stops = route.stops;

    // This only works with current css - if we add mobile support this should be optimized
    const distanceFromSide = 390;
    let droppedDistance = e.clientX - distanceFromSide;

    // console.log("Distance from side: ", droppedDistance);

    // Calculate where to place it
    const durationFromEarliestMinutes = route.meta.timeFrame
      .from!.diff(route.meta.timeFrame.from!)
      .as("minutes");
    let currentDistance = this.props.store.minutesToPixels(
      durationFromEarliestMinutes
    );

    let stopIndex = 0;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      currentDistance += this.props.store.minutesToPixels(
        stop.estimates.waitingTime.as("minutes")
      );
      currentDistance += this.props.store.minutesToPixels(
        stop.estimates.drivingTime.as("minutes")
      );

      stopIndex = i;

      if (currentDistance >= droppedDistance) {
        break;
      }

      currentDistance += this.props.store.minutesToPixels(
        stop.estimates.loadingTime.as("minutes")
      );
    }

    const type = e.dataTransfer.getData("type") as DragType;

    const index = Number(e.dataTransfer.getData("index"));
    // console.log("DRAG TYPE: ", type);
    // console.log("INDEX: ", index);

    if (type === "UnscheduledTask") {
      this.props.store.plan.unscheduledTasks.splice(index, 1);
      // console.log("Completed unscheduled");
    } else {
      // const routeIndex = Number(e.dataTransfer.getData("routeIndex"));
      // console.log("Completed stop drag with route index: ", routeIndex);
    }

    // console.log("Dropped at stop index: ", i);
    this.props.store.updateRoutes(this.props.route, stopIndex);
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
          onDragOver={e => {
            if (!this.state.draggedOver) {
              this.setState({ draggedOver: true });
            }
            e.preventDefault();
          }}
          onDragLeave={e => {
            this.setState({ draggedOver: false });
            e.preventDefault();
          }}
          onDrop={e => this.onDrop(e)}
          className={classNames}
        >
          {this.renderComponents()}
        </div>
      </div>
    );
  }
}
