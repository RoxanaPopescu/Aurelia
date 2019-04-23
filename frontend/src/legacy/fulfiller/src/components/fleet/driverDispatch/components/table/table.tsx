import React from "react";
import "./table.scss";
import { TableComponent } from "shared/src/webKit";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { driverDispatchService } from "../../driverDispatchService";

@observer
export default class extends React.Component {
  private getHeaders() {
    if (driverDispatchService.state === "forecasts") {
      return [
        { key: "reference", text: "Reference" },
        { key: "consignor", text: "Consignor" },
        { key: "time-period", text: "Time period" },
        { key: "starting-addresse", text: "Starting addresse" },
        { key: "vehicle", text: "Vehicle" },
        { key: "assigned-slots", text: "Assigned slots" },
        { key: "unassigned-slots", text: "Missing" }
      ];
    } else if (driverDispatchService.state === "preBookings") {
      return [
        { key: "reference", text: "Reference" },
        { key: "consignor", text: "Consignor" },
        { key: "time-period", text: "Time period" },
        { key: "starting-addresse", text: "Starting addresse" },
        { key: "driver", text: "Driver" },
        { key: "vehicle", text: "Vehicle" }
      ];
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return [
        { key: "reference", text: "Reference" },
        { key: "consignor", text: "Consignor" },
        { key: "time-period", text: "Time period" },
        { key: "starting-addresse", text: "Starting addresse" },
        { key: "end-addresse", text: "End addresse" },
        { key: "vehicle", text: "Vehicle" },
        { key: "stops", text: "Stops" },
        { key: "colli", text: "Colli" },
        { key: "complexity", text: "Complexity" }
      ];
    } else {
      return [
        { key: "reference", text: "Reference" },
        { key: "consignor", text: "Consignor" },
        { key: "time-period", text: "Time period" },
        { key: "starting-addresse", text: "Starting addresse" },
        { key: "end-addresse", text: "End addresse" },
        { key: "driver", text: "Driver" },
        { key: "vehicle", text: "Vehicle" },
        { key: "stops", text: "Stops" },
        { key: "colli", text: "Colli" },
        { key: "complexity", text: "Complexity" }
      ];
    }
  }

  private getRows() {
    if (driverDispatchService.state === "forecasts") {
      return driverDispatchService.forecasts.map(f => {
        return [
          f.slug,
          f.consignorName,
          Localization.formatTimeRange(f.timeFrame),
          f.startAddress,
          f.vehicleType.name,
          `${f.slots.assigned}/${f.slots.total}`,
          `${f.slots.total - f.slots.assigned}`
        ];
      });
    } else if (driverDispatchService.state === "preBookings") {
      return driverDispatchService.preBookings.map(p => {
        return [
          p.slug,
          p.consignorName,
          Localization.formatTimeRange(p.timeFrame),
          p.startAddress,
          `${p.driver.formattedName} (${p.driver.phoneNumber.toString()})`,
          p.vehicleType.name
        ];
      });
    } else {
      // TODO: Assigned and unassigned route
      return [];
    }
  }

  render() {
    return (
      <div className="c-driverDispatch-table-container">
        <TableComponent
          canSelectRow={() => false}
          data={{
            headers: this.getHeaders(),
            rows: this.getRows()
          }}
        />
      </div>
    );
  }
}
