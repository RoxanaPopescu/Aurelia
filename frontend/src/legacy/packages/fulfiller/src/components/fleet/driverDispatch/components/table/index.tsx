import React from "react";
import "./index.scss";
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
import { Route } from "shared/src/components/routes/list/models/route";
import { PreBooking } from "../../models/preBooking";
import { FulfillerSubPage } from "../../../../navigation/page";
import { Link } from "react-router-dom";
import { DateTimeRange } from "../../../../../../../shared/src/model/general/dateTimeRange";
import { SubPage } from "../../../../../../../shared/src/utillity/page";

interface Props {
  page: "dispatch" | "forecasts";
  onPreBookingAction?(preBooking: PreBooking);
  onUnassignedRouteAction?(unassignedRoute: Route);
  onAssignedRouteAction?(assignedRoute: Route);
  onForecastChange?(forecast: Forecast, totalSlots: number);
  onForecastEnter?(forecast: Forecast, totalSlots: number);
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
        { key: "phone", content: "Phone" },
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
        { key: "date-start", content: "Date start" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting address" },
        { key: "end-addresse", content: "End address" },
        { key: "vehicle", content: "Vehicle" }
      ];
    } else if (
      driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug
    ) {
      return [
        { key: "reference", content: "Reference" },
        { key: "customer", content: "Customer" },
        { key: "date-start", content: "Date start" },
        { key: "time-period", content: "Time period" },
        { key: "starting-addresse", content: "Starting address" },
        { key: "end-addresse", content: "End address" },
        { key: "driver", content: "Driver" },
        { key: "phone", content: "Phone" }
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
            <Link
              to={FulfillerSubPage.path(
                FulfillerSubPage.CreatePreBooking
              ).replace(":id", forecast.id)}
              className="c-driverDispatch-table-actionButton"
            >
              <Button type={ButtonType.Light} size={ButtonSize.Small}>
                Assign
              </Button>
            </Link>
          </>
        );
      }
    } else {
      return (
        <InputNumbers
          onChange={value => {
            if (value && this.props.onForecastChange) {
              this.props.onForecastChange(forecast, value);
            }
          }}
          onEnter={value => {
            if (value && this.props.onForecastEnter) {
              this.props.onForecastEnter(forecast, value);
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
        <div className="c-driverDispatch-table-actionButton">
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            onClick={() => {
              if (this.props.onUnassignedRouteAction) {
                this.props.onUnassignedRouteAction(route);
              }
            }}
          >
            Match
          </Button>
        </div>
      </>
    );
  }

  private getPreBookingActions(preBooking: PreBooking) {
    return (
      <>
        {preBooking.forecast.vehicleType.name}
        <div className="c-driverDispatch-table-actionButton">
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            onClick={() => {
              if (this.props.onPreBookingAction) {
                this.props.onPreBookingAction(preBooking);
              }
            }}
          >
            Actions
          </Button>
        </div>
      </>
    );
  }

  private getDisabledRowIndexes() {
    let array: number[] = [];

    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug &&
        this.props.page !== "forecasts") {
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
            f.fulfillee.name,
            Localization.formatDate(f.date),
            Localization.formatTimeRange(f.timePeriod),
            f.startingLocation.address.primary,
            f.vehicleType.name,
            `${f.slots.assigned}/${f.slots.total}`,
            this.getForecastAction(f)
          ];
        } else {
          return [
            f.fulfillee.name,
            Localization.formatDate(f.date),
            Localization.formatTimeRange(f.timePeriod),
            f.startingLocation.address.primary,
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
              if (
                checked &&
                driverDispatchService.selectedItemIndexes.indexOf(i) === -1
              ) {
                checkedRows.push(i);
              } else {
                checkedRows.splice(checkedRows.indexOf(i), 1);
              }

              driverDispatchService.selectedItemIndexes = checkedRows;
            }}
            key={p.id}
          />,
          p.forecast.fulfillee.name,
          Localization.formatDate(p.forecast.date),
          Localization.formatTimeRange(p.forecast.timePeriod),
          p.forecast.startingLocation.address.primary,
          // tslint:disable-next-line: jsx-wrap-multiline
          <Link
            to={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(
              ":id",
              p.driver.id.toString()
            )}
            key={`preBooking-${p.slug}-driver-${p.driver.id}`}
          >
            {`${p.driver.formattedName} (${p.driver.id})`}
          </Link>,
          // tslint:disable-next-line: jsx-wrap-multiline
          <a
            key={`preBooking-${p.id}-driverPhone-${p.driver.id}`}
            href={`tel:${p.driver.phone.number}`}
          >
            {p.driver.phone.number}
          </a>,
          this.getPreBookingActions(p)
        ];
      });
    } else if (
      driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug
    ) {
      return driverDispatchService.assignedRoutes.map((ar, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <Link
            to={SubPage.path(SubPage.RouteDetails).replace(":id", ar.slug)}
            key={`route-${ar.id}-slug-${ar.slug}`}
          >
            {ar.slug}
          </Link>,
          ar.consignorNames,
          Localization.formatDate(ar.startDateTime),
          Localization.formatTimeRange(
            new DateTimeRange({ from: ar.startDateTime, to: ar.endDateTime })
          ),
          ar.startAddress.primary,
          ar.endAddress.primary,
          // tslint:disable-next-line: jsx-wrap-multiline
          <Link
            to={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(
              ":id",
              ar.driver!.id.toString()
            )}
            key={`route-${ar.reference}-driver-${ar.driver!.id}`}
          >
            {`${ar.driver!.name} (${ar.driver!.id})`}
          </Link>,
          // tslint:disable-next-line: jsx-wrap-multiline
          <a
            key={`route-${ar.slug}-driverPhone-${ar.driver!.id}`}
            href={`tel:${ar.driver!.phone.number}`}
          >
            {ar.driver!.phone.number}
          </a>
        ];
      });
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return driverDispatchService.unassignedRoutes.map((ur, i) => {
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
          // tslint:disable-next-line: jsx-wrap-multiline
          <Link
            to={SubPage.path(SubPage.RouteDetails).replace(":id", ur.slug)}
            key={`route-${ur.id}-slug-${ur.slug}`}
          >
            {ur.slug}
          </Link>,
          ur.consignorNames,
          Localization.formatDate(ur.startDateTime),
          Localization.formatTimeRange(
            new DateTimeRange({ from: ur.startDateTime, to: ur.endDateTime })
          ),
          ur.startAddress.primary,
          ur.endAddress.primary,
          this.getMatchRoute(ur)
        ];
      });
    } else {
      return [];
    }
  }

  private get gridTemplateColumns() {
    if (
      driverDispatchService.state.slug === DispatchState.map.preBooking.slug
    ) {
      return "min-content auto auto auto auto auto auto auto";
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return "min-content auto auto auto auto auto auto auto";
    } else {
      return undefined;
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
            gridTemplateColumns={this.gridTemplateColumns}
          />
        </PageContentComponent>
      </>
    );
  }
}
