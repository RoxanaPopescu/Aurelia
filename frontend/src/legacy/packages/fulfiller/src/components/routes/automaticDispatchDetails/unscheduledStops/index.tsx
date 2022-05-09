import React from "react";
import "./styles.scss";
import Stop from "./stop";
import { observer } from "mobx-react";
import { RoutePlanningStore } from "../store";
import Localization from "shared/src/localization";

interface Props {
  store: RoutePlanningStore;
}

@observer
export default class RoutePlanningUnscheduledStopsComponent extends React.Component<
  Props
> {
  renderStops() {
    let components: JSX.Element[] = [];
    let unscheduledShipments = this.props.store.plan.unscheduledShipments;

    for (let i = 0; i < unscheduledShipments.length; i++) {
      const task = unscheduledShipments[i]["shipment"];

      components.push(
        <Stop
          store={this.props.store}
          task={unscheduledShipments[i]}
          taskNumber={i + 1}
          key={"unscheduledStop_" + task.delivery.id}
        />
      );
    }

    return components;
  }

  render() {
    let classNames = "c-routePlanning-routes-unscheduledTasksBar scroll";
    if (this.props.store.updatingRoute) {
      classNames += " disabled";
    }

    return (
      <div className={classNames}>
        <div className="c-routePlanning-routes-unscheduledTasksBar-title">
          <span>
            {Localization.operationsValue(
              "RoutePlanning_RoutePlan_UnplannedTasks"
            )}
          </span>
        </div>
        {this.renderStops()}
      </div>
    );
  }
}
