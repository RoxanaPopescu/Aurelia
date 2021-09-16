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
    let unscheduledTasks = this.props.store.plan.unscheduledTasks;

    for (let i = 0; i < unscheduledTasks.length; i++) {
      const task = unscheduledTasks[i];
      components.push(
        <Stop
          store={this.props.store}
          task={unscheduledTasks[i]}
          key={"unscheduledStop_" + task.delivery.id}
        />
      );
    }

    return components;
  }

  render() {
    let classNames = "c-routePlanning-routes-unscheduledTasksBar";
    if (this.props.store.updatingRoute) {
      classNames += " disabled";
    }

    return (
      <div className={classNames}>
        <div className="c-routePlanning-routes-unscheduledTasksBar-title font-small">
          {Localization.operationsValue(
            "RoutePlanning_RoutePlan_UnplannedTasks"
          )}
        </div>
        {this.renderStops()}
      </div>
    );
  }
}
