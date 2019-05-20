import React from "react";
import "./table.scss";
import { TableComponent } from "shared/src/webKit";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { driverDispatchService } from "../../driverDispatchService";
import { PageContentComponent } from "../../../../../../../shared/src/components/pageContent/index";
import { ButtonSize } from "../../../../../../../shared/src/webKit/button/index";
import { Forecast } from "../../models/forecast";
import InputCheckbox from "../../../../../../../shared/src/webKit/input/checkbox/index";
import {
  Button,
  ButtonType
} from "../../../../../../../shared/src/webKit/button/index";
import { Route } from "shared/src/model/logistics/routes";
import { PreBooking } from "../../models/preBooking";

interface State {
  checkedRows: number[];
}

@observer
export default class extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      checkedRows: []
    };
  }

  componentWillMount() {
    this.setState({ checkedRows: [] });
  }

  private getHeaders() {
    if (driverDispatchService.state === "forecasts") {
      return [
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting addresse" },
        { key: "vehicle", content: "Vehicle" },
        { key: "assigned-slots", content: "Assigned slots" },
        { key: "unassigned-slots", content: "Missing" }
      ];
    } else if (driverDispatchService.state === "preBookings") {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.preBookings.length !== 0 &&
                this.state.checkedRows.length ===
                  driverDispatchService.preBookings.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.preBookings.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                this.setState({ checkedRows: checkedRows });
              }}
            />
          )
        },
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting addresse" },
        { key: "driver", content: "Driver" },
        { key: "vehicle", content: "Vehicle" }
      ];
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.preBookings.length !== 0 &&
                this.state.checkedRows.length ===
                  driverDispatchService.preBookings.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.preBookings.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                this.setState({ checkedRows: checkedRows });
              }}
            />
          )
        },
        { key: "reference", content: "Reference" },
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting addresse" },
        { key: "end-addresse", content: "End addresse" },
        { key: "vehicle", content: "Vehicle" }
      ];
    } else if (driverDispatchService.state === "assignedRoutes") {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.preBookings.length !== 0 &&
                this.state.checkedRows.length ===
                  driverDispatchService.preBookings.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.preBookings.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                this.setState({ checkedRows: checkedRows });
              }}
            />
          )
        },
        { key: "reference", content: "Reference" },
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting addresse" },
        { key: "end-addresse", content: "End addresse" },
        { key: "driver", content: "Driver" }
      ];
    } else {
      return [];
    }
  }

  private getAssignForecast(forecast: Forecast) {
    if (forecast.slots.assigned === forecast.slots.total) {
      return <div className="c-driverDispatch-checkMark" />;
    } else {
      return (
        <>
          {`${forecast.slots.total - forecast.slots.assigned}`}
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            className="c-driverDispatch-table-actionButton"
          >
            Assign
          </Button>
        </>
      );
    }
  }

  private getMatchRoute(route: Route) {
    return (
      <>
        {route.vehicleType.name}
        <Button
          type={ButtonType.Light}
          size={ButtonSize.Small}
          className="c-driverDispatch-table-actionButton"
        >
          Match
        </Button>
      </>
    );
  }

  private getPreBookingActions(preBooking: PreBooking) {
    return (
      <>
        {preBooking.vehicleType.name}
        <Button
          type={ButtonType.Light}
          size={ButtonSize.Small}
          className="c-driverDispatch-table-actionButton"
        >
          Actions
        </Button>
      </>
    );
  }

  private getRemoveDriver(route: Route) {
    return (
      <>
        {`${route.driver!.name} (${route.driver!.phone.number})`}
        <div className="c-driverDispatch-table-actionButton" />
      </>
    );
  }

  private getDisabledRowIndexes() {
    let array: number[] = [];

    if (driverDispatchService.state === "forecasts") {
      driverDispatchService.forecasts.map((f, i) => {
        if (f.slots.total === f.slots.assigned) {
          array.push(i);
        }
      });
    }

    return array;
  }

  private getRows() {
    if (driverDispatchService.state === "forecasts") {
      return driverDispatchService.forecasts.map(f => {
        return [
          f.fulfilleeName,
          Localization.formatTimeRange(f.timeFrame),
          f.startAddress,
          f.vehicleType.name,
          `${f.slots.assigned}/${f.slots.total}`,
          this.getAssignForecast(f)
        ];
      });
    } else if (driverDispatchService.state === "preBookings") {
      return driverDispatchService.preBookings.map((p, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={this.state.checkedRows.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = this.state.checkedRows;
              if (checked) {
                checkedRows.push(i);
                this.setState({ checkedRows: checkedRows });
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                this.setState({
                  checkedRows: checkedRows
                });
              }
            }}
            key={p.id}
          />,
          p.fulfilleeName,
          Localization.formatTimeRange(p.timeFrame),
          p.startAddress,
          `${p.driver.formattedName} (${p.driver.phoneNumber.number})`,
          this.getPreBookingActions(p)
        ];
      });
    } else if (driverDispatchService.state === "assignedRoutes") {
      return driverDispatchService.assignedRoutes.map((ar, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={this.state.checkedRows.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = this.state.checkedRows;
              if (checked) {
                checkedRows.push(i);
                this.setState({ checkedRows: checkedRows });
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                this.setState({
                  checkedRows: checkedRows
                });
              }
            }}
            key={ar.id}
          />,
          ar.reference,
          Localization.formatTimeRange(ar.plannedTimeFrame),
          ar.fulfiller.companyName,
          ar.stops[0].location.address.toString(),
          ar.stops[ar.stops.length - 1].location.address.toString(),
          this.getRemoveDriver(ar)
        ];
      });
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return driverDispatchService.assignedRoutes.map((ur, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={this.state.checkedRows.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = this.state.checkedRows;
              if (checked) {
                checkedRows.push(i);
                this.setState({ checkedRows: checkedRows });
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                this.setState({
                  checkedRows: checkedRows
                });
              }
            }}
            key={ur.id}
          />,
          ur.slug,
          Localization.formatTimeRange(ur.plannedTimeFrame),
          ur.fulfiller.companyName,
          ur.stops[0].location.address.toString(),
          ur.stops[ur.stops.length - 1].location.address.toString(),
          this.getMatchRoute(ur)
        ];
      });
    } else {
      return [];
    }
  }

  render() {
    return (
      <PageContentComponent>
        <TableComponent
          canSelectRow={() => false}
          newVersion={true}
          data={{
            headers: this.getHeaders(),
            rows: this.getRows()
          }}
          pagination={{
            pages: 3,
            currentPageIndex: 1,
            resultsPerPage: 40,
            onPageChange: () => {
              /* */
            }
          }}
          highlightedRowIndexes={this.state.checkedRows}
          disabledRowIndexes={this.getDisabledRowIndexes()}
          gridTemplateColumns={
            driverDispatchService.state === "preBookings"
              ? "min-content auto auto auto auto auto"
              : undefined
          }
        />
      </PageContentComponent>
    );
  }
}
