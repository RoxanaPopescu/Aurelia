import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { RoutePlanningStore } from "../../store";
import { Shipment } from "app/model/shipment";

interface Props {
  task: { shipment: Shipment; reasons: string[] };
  store: RoutePlanningStore;
  taskNumber: number;
}
@observer
export default class RoutePlanningRoutesStopComponent extends React.Component<
  Props
> {
  onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("type", "UnscheduledTask");
    e.dataTransfer.setData("index", String(this.props.taskNumber - 1));
  }

  render() {
    const stop = this.props.task["shipment"].delivery;

    return (
      <div
        className="c-routePlanning-unscheduledStop"
        onClick={() => {
          // FIXME: Currently data-finance are not sending data correctly. For now we forward the GUID as a SLUG.
          window.open("/routes/details/" + this.props.task.shipment.id.replaceAll("-", ""))

          /*
          this.props.store.zoomToCoordinate(
            stop.location.position!.toGoogleLatLng()
          );
          this.props.store.focusRoute(undefined);

          */
        }}
        title={this.props.task.reasons.join(", ")}
      >
        <RoutePlanningRoutesStopItemComponent
          title={Localization.sharedValue("Timeframe")}
          description={Localization.formatTimeRange(stop.arrivalTimeFrame)}
        />
        <RoutePlanningRoutesStopItemComponent
          title={Localization.sharedValue("Address")}
          description={stop.location.address.primary}
        />
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
