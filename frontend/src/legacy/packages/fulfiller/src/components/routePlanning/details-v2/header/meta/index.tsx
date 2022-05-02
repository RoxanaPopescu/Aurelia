import React from "react";
import "./styles.scss";
import HeaderItemComponent from "./item";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";
import { observer } from "mobx-react";
import { RoutePlanRoute } from "shared/src/model/logistics/routePlanning";

interface Props {
  store: RoutePlanningStore;
}

@observer
export default class MetaHeaderComponent extends React.Component<Props> {
  renderOverall() {
    return (
      <React.Fragment>
        <HeaderItemComponent
          title={Localization.sharedValue("Timeframe")}
          description={Localization.formatDateTimeRange(
            this.props.store.plan.meta.timeFrame
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Route_Count")}
          description={
            this.props.store.plan.routes.length +
            " " +
            Localization.sharedValue("Routes")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Planned_Stops")}
          description={
            this.props.store.plan.meta.stopsCount +
            " " +
            Localization.sharedValue("Stops")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Unplanned_Tasks")}
          description={
            this.props.store.plan.unscheduledTasks.length +
            " " +
            Localization.sharedValue("Tasks")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Colli_Count")}
          description={
            this.props.store.plan.meta.colliCount +
            " " +
            Localization.sharedValue("Colli")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Order_Count")}
          description={
            this.props.store.plan.meta.orderCount +
            " " +
            Localization.sharedValue("Orders")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Time")}
          description={Localization.formatDuration(
            this.props.store.plan.meta.totalTime, { units: ["h", "m"] }
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Distance")}
          description={Localization.formatDistance(
            this.props.store.plan.meta.distance
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Weight")}
          description={Localization.formatWeight(
            this.props.store.plan.meta.weight
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Volume")}
          description={Localization.formatVolume(
            this.props.store.plan.meta.volume
          )}
        />
      </React.Fragment>
    );
  }

  renderRoute(route: RoutePlanRoute) {
    return (
      <React.Fragment>
        <HeaderItemComponent
          title={Localization.sharedValue("Timeframe")}
          description={Localization.formatDateTimeRange(route.meta.timeFrame)}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Planned_Stops")}
          description={
            route.meta.stopsCount + " " + Localization.sharedValue("Stops")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Colli_Count")}
          description={
            route.meta.colliCount + " " + Localization.sharedValue("Colli")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Order_Count")}
          description={
            route.meta.orderCount + " " + Localization.sharedValue("Orders")
          }
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Time")}
          description={Localization.formatDuration(
            route.meta.timeFrame.duration, { units: ["h", "m"] }
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Distance")}
          description={Localization.formatDistance(
            route.meta.distance
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Weight")}
          description={Localization.formatWeight(
            route.meta.weight
          )}
        />
        <HeaderItemComponent
          title={Localization.sharedValue("Total_Volume")}
          description={Localization.formatVolume(
            route.meta.volume
          )}
        />
      </React.Fragment>
    );
  }

  render() {
    let route = this.props.store.focusedRoute;
    if (route) {
      return this.renderRoute(route);
    } else {
      return this.renderOverall();
    }
  }
}
