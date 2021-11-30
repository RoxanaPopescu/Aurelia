import React from "react";
import "./styles.scss";
import HeaderItemComponent from "./item";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";
import { observer } from "mobx-react";
import { RouteBase, RouteStop } from "app/model/route";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

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
            this.props.store.timeFrame
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
          title={Localization.sharedValue("Unplanned_Shipments")}
          description={
            this.props.store.plan.unscheduledShipments.length +
            " " +
            Localization.sharedValue("Shipments")
          }
        />
      </React.Fragment>
    );
  }

  renderRoute(route: RouteBase) {
    return (
      <React.Fragment>
        <HeaderItemComponent
          title={Localization.sharedValue("Timeframe")}
          description={Localization.formatDateTimeRange(new DateTimeRange({ from: (route.stops[0] as RouteStop).estimates!.timeFrame.from, to: (route.stops[route.stops.length-1] as RouteStop).estimates!.timeFrame.to }))}
        />
        <HeaderItemComponent
          title="Id"
          description={route.slug}
        />
        <HeaderItemComponent
          title={Localization.operationsValue("Dispatch_Driver")}
          description={(route.driver?.name.toString() ?? "") + " (" + (route.driver?.id ?? "") + ")"}
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
