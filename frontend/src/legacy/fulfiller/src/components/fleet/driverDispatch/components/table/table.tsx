import React from "react";
import "./table.scss";
import { TableComponent, InputNumbers } from "shared/src/webKit";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import {
  driverDispatchService,
  DispatchState
} from "../../driverDispatchService";
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

interface Props {
  page: "dispatch" | "forecasts";
  onPreBookingAction(preBooking: PreBooking);
  onForecastEdit?(forecast: Forecast, totalSlots: number);
}

@observer
export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    driverDispatchService.selectedItemIndexes = [];
  }

  private getHeaders() {
    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug) {
      if (this.props.page === "dispatch") {
        return [
          { key: "customer", content: "Customer" },
          { key: "date-start", content: "Date start" },
          { key: "time-period", content: "Time period" },
          { key: "starting-addresse", content: "Starting address" },
          { key: "vehicle", content: "Vehicle" },
          { key: "assigned-slots", content: "Assigned slots" },
          { key: "unassigned-slots", content: "Missing" }
        ];
      } else {
        return [
          { key: "customer", content: "Customer" },
          { key: "date-start", content: "Date start" },
          { key: "time-period", content: "Time period" },
          { key: "starting-addresse", content: "Starting address" },
          { key: "vehicle", content: "Vehicle" },
          { key: "slots", content: "Total slots" }
        ];
      }
    } else if (
      driverDispatchService.state.slug === DispatchState.map.preBooking.slug
    ) {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.preBookings.length !== 0 &&
                driverDispatchService.selectedItemIndexes.length ===
                  driverDispatchService.preBookings.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.preBookings.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                driverDispatchService.selectedItemIndexes = checkedRows;
              }}
            />
          )
        },
        { key: "customer", content: "Customer" },
        { key: "date-start", content: "Date start" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting address" },
        { key: "driver", content: "Driver" },
        { key: "vehicle", content: "Vehicle" }
      ];
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.unassignedRoutes.length !== 0 &&
                driverDispatchService.selectedItemIndexes.length ===
                  driverDispatchService.unassignedRoutes.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.unassignedRoutes.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                driverDispatchService.selectedItemIndexes = checkedRows;
              }}
            />
          )
        },
        { key: "reference", content: "Reference" },
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting address" },
        { key: "end-addresse", content: "End address" },
        { key: "vehicle", content: "Vehicle" }
      ];
    } else if (
      driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug
    ) {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.assignedRoutes.length !== 0 &&
                driverDispatchService.selectedItemIndexes.length ===
                  driverDispatchService.assignedRoutes.length
              }
              onChange={checked => {
                var checkedRows: number[] = [];
                if (checked) {
                  driverDispatchService.assignedRoutes.forEach((p, i) => {
                    checkedRows.push(i);
                  });
                }
                driverDispatchService.selectedItemIndexes = checkedRows;
              }}
            />
          )
        },
        { key: "reference", content: "Reference" },
        { key: "customer", content: "Customer" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting address" },
        { key: "end-addresse", content: "End address" },
        { key: "driver", content: "Driver" }
      ];
    } else {
      return [];
    }
  }

  private getForecastAction(forecast: Forecast) {
    if (this.props.page === "dispatch") {
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
    } else {
      return (
        <InputNumbers
          onChange={() => {
            /** */
          }}
          onEnter={value => {
            if (value && this.props.onForecastEdit) {
              this.props.onForecastEdit(forecast, value);
            }
          }}
          className="c-driverDispatch-forecastSlotsInput"
          value={forecast.slots.total}
        />
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
          onClick={() => {
            this.props.onPreBookingAction(preBooking);
          }}
        >
          Actions
        </Button>
      </>
    );
  }

  private getRemoveDriver(route: Route) {
    return (
      <>
        {route.driver
          ? `${route.driver.name} (${route.driver.phone.number})`
          : "--"}
        <div className="c-driverDispatch-table-actionButton" />
      </>
    );
  }

  private getDisabledRowIndexes() {
    let array: number[] = [];

    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug) {
      driverDispatchService.forecasts.map((f, i) => {
        if (f.slots.total === f.slots.assigned) {
          array.push(i);
        }
      });
    }

    return array;
  }

  private getRows() {
    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug) {
      return driverDispatchService.forecasts.map(f => {
        if (this.props.page === "dispatch") {
          return [
            f.fulfilleeName,
            Localization.formatDate(f.date),
            Localization.formatTimeRange(f.timeFrame),
            f.startingAddress,
            f.vehicleType.name,
            `${f.slots.assigned}/${f.slots.total}`,
            this.getForecastAction(f)
          ];
        } else {
          return [
            f.fulfilleeName,
            Localization.formatDate(f.date),
            Localization.formatTimeRange(f.timeFrame),
            f.startingAddress,
            f.vehicleType.name,
            this.getForecastAction(f)
          ];
        }
      });
    } else if (
      driverDispatchService.state.slug === DispatchState.map.preBooking.slug
    ) {
      return driverDispatchService.preBookings.map((p, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={driverDispatchService.selectedItemIndexes.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = driverDispatchService.selectedItemIndexes;
              if (checked) {
                checkedRows.push(i);
                driverDispatchService.selectedItemIndexes = checkedRows;
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                driverDispatchService.selectedItemIndexes = checkedRows;
              }
            }}
            key={p.id}
          />,
          p.fulfilleeName,
          Localization.formatDate(p.date),
          Localization.formatTimeRange(p.timeFrame),
          p.startingAddress,
          `${p.driver.formattedName} (${p.driver.phoneNumber.number})`,
          this.getPreBookingActions(p)
        ];
      });
    } else if (
      driverDispatchService.state.slug === DispatchState.map.forecast.slug
    ) {
      return driverDispatchService.assignedRoutes.map((ar, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={driverDispatchService.selectedItemIndexes.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = driverDispatchService.selectedItemIndexes;
              if (checked) {
                checkedRows.push(i);
                driverDispatchService.selectedItemIndexes = checkedRows;
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                driverDispatchService.selectedItemIndexes = checkedRows;
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
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return driverDispatchService.assignedRoutes.map((ur, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={driverDispatchService.selectedItemIndexes.indexOf(i) > -1}
            onChange={checked => {
              var checkedRows = driverDispatchService.selectedItemIndexes;
              if (checked) {
                checkedRows.push(i);
                driverDispatchService.selectedItemIndexes = checkedRows;
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
                driverDispatchService.selectedItemIndexes = checkedRows;
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
      <>
        <PageContentComponent>
          <TableComponent
            canSelectRow={() => false}
            newVersion={true}
            data={{
              headers: this.getHeaders(),
              rows: this.getRows()
            }}
            highlightedRowIndexes={driverDispatchService.selectedItemIndexes}
            disabledRowIndexes={this.getDisabledRowIndexes()}
            gridTemplateColumns={
              driverDispatchService.state.slug ===
              DispatchState.map.preBooking.slug
                ? "min-content auto auto auto auto auto auto"
                : undefined
            }
          />
        </PageContentComponent>
      </>
    );
  }
}
