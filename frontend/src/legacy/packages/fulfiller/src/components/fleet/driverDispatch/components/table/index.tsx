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
import { Prebooking } from "../../models/prebooking";
import { FulfillerSubPage } from "../../../../navigation/page";
import { Link } from "react-router-dom";
import { DateTimeRange } from "../../../../../../../shared/src/model/general/dateTimeRange";
import { SubPage } from "../../../../../../../shared/src/utillity/page";
import Mousetrap from 'mousetrap';

interface Props {
  page: "dispatch" | "forecasts";
  onPrebookingAction?(prebooking: Prebooking);
  onUnassignedRouteAction?(unassignedRoute: Route);
  onAssignedRouteAction?(assignedRoute: Route);
  onForecastChange?(forecast: Forecast, totalSlots: number);
  onForecastEnter?(forecast: Forecast, totalSlots: number);
}

@observer
export default class extends React.Component<Props> {
  shiftDown: boolean = false;

  constructor(props: Props) {
    super(props);

    Mousetrap.bind("shift", () => {
      this.shiftDown = true;
    });
    Mousetrap.bind("shift", () => {
      this.shiftDown = false;
    }, "keyup");
  }

  componentWillMount() {
    driverDispatchService.selectedItemIds = [];
  }

  private getHeaders() {
    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug) {
      if (this.props.page === "dispatch") {
        return [
          { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
          { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
          { key: "time-period", content: Localization.sharedValue("TimePeriod") },
          { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
          { key: "vehicle", content: Localization.sharedValue("Vehicle") },
          { key: "assigned-slots", content: Localization.operationsValue("Dispatch_Forecasts_SlotsAssigned") },
          { key: "unassigned-slots", content: Localization.operationsValue("Dispatch_Forecasts_SlotsUnassigned") }
        ];
      } else {
        return [
          { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
          { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
          { key: "time-period", content: Localization.sharedValue("TimePeriod") },
          { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
          { key: "vehicle", content: Localization.sharedValue("Vehicle") },
          { key: "slots", content: Localization.operationsValue("Dispatch_Forecasts_SlotsTotal") }
        ];
      }
    } else if (
      driverDispatchService.state.slug === DispatchState.map.prebooking.slug
    ) {
      return [
        {
          key: "select",
          content: (
            <InputCheckbox
              checked={
                driverDispatchService.prebookings.length !== 0 &&
                driverDispatchService.selectedItemIds.length ===
                  driverDispatchService.prebookings.length
              }
              onChange={checked => {
                var checkedRows: string[] = [];
                if (checked) {
                  driverDispatchService.prebookings.forEach(p => {
                    checkedRows.push(p.id);
                  });
                }
                driverDispatchService.selectedItemIds = checkedRows;
              }}
            />
          )
        },
        { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
        { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
        { key: "time-period", content: Localization.sharedValue("TimePeriod") },
        { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
        { key: "driver", content: Localization.sharedValue("User_Driver") },
        { key: "phone", content: Localization.sharedValue("Phone") },
        { key: "vehicle", content: Localization.sharedValue("Vehicle") }
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
                driverDispatchService.selectedItemIds.length ===
                  driverDispatchService.unassignedRoutes.length
              }
              onChange={checked => {
                var checkedRows: string[] = [];
                if (checked) {
                  driverDispatchService.unassignedRoutes.forEach(p => {
                    checkedRows.push(p.id);
                  });
                }
                driverDispatchService.selectedItemIds = checkedRows;
              }}
            />
          )
        },
        { key: "reference", content: Localization.sharedValue("Route_TableHeader_Reference") },
        { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
        { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
        { key: "time-period", content: Localization.sharedValue("TimePeriod") },
        { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
        { key: "end-addresse", content: Localization.operationsValue("Dispatch_EndAddress") },
        { key: "vehicle", content: Localization.sharedValue("Vehicle") }
      ];
    } else if (
      driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug
    ) {
      return [
        { key: "reference", content: Localization.sharedValue("Route_TableHeader_Reference") },
        { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
        { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
        { key: "time-period", content: Localization.sharedValue("TimePeriod") },
        { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
        { key: "end-addresse", content: Localization.operationsValue("Dispatch_EndAddress") },
        { key: "driver", content: Localization.sharedValue("User_Driver") },
        { key: "phone", content: Localization.sharedValue("Phone") }
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
                FulfillerSubPage.CreatePrebooking
              ).replace(":id", forecast.id)}
              className="c-driverDispatch-table-actionButton"
            >
              <Button type={ButtonType.Light} size={ButtonSize.Small}>
                {Localization.operationsValue("Dispatch_Assign")}
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
          size={"small"}
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
            {Localization.operationsValue("Dispatch_Match")}
          </Button>
        </div>
      </>
    );
  }

  private getPrebookingActions(prebooking: Prebooking) {
    return (
      <>
        {prebooking.forecast.vehicleType.name}
        <div className="c-driverDispatch-table-actionButton">
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            onClick={() => {
              if (this.props.onPrebookingAction) {
                this.props.onPrebookingAction(prebooking);
              }
            }}
          >
            {Localization.operationsValue("Dispatch_Actions")}
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

  private handleCheckboxClick(checked: boolean, currentIndex: number, currentId: string) {
    var checkedRowIds = driverDispatchService.selectedItemIds;

    if (
      checked &&
      this.highlightedIndexes.indexOf(currentIndex) === -1
    ) {
      if (this.shiftDown) {
        var indexes = this.highlightedIndexes;
        if (currentIndex > indexes.sort()[indexes.length - 1]) {
          for (var j = indexes.sort()[indexes.length - 1] + 1; j <= currentIndex; j++) {
            indexes.push(j);
          }
        } else if (currentIndex < indexes.sort()[0]) {
          for (var j = indexes.sort()[0] - 1; j >= currentIndex; j--) {
            indexes.push(j);
          }
        }

        checkedRowIds = indexes.map(i => {
          if (driverDispatchService.state.slug === DispatchState.map.prebooking.slug) {
            return driverDispatchService.prebookings[i].id;
          } else {
            return driverDispatchService.unassignedRoutes[i].id;
          }
        });
      } else {
        checkedRowIds.push(currentId);
      }
    } else {
      checkedRowIds.splice(checkedRowIds.indexOf(currentId), 1);
    }

    driverDispatchService.selectedItemIds = checkedRowIds;
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
      driverDispatchService.state.slug === DispatchState.map.prebooking.slug
    ) {
      return driverDispatchService.prebookings.map((p, i) => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputCheckbox
            checked={driverDispatchService.selectedItemIds.indexOf(p.id) > -1}
            onChange={checked => {
              this.handleCheckboxClick(checked, i, p.id);
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
            key={`prebooking-${p.slug}-driver-${p.driver.id}`}
          >
            {`${p.driver.formattedName} (${p.driver.id})`}
          </Link>,
          // tslint:disable-next-line: jsx-wrap-multiline
          <a
            key={`prebooking-${p.id}-driverPhone-${p.driver.id}`}
            href={`tel:${p.driver.phone.number}`}
          >
            {p.driver.phone.number}
          </a>,
          this.getPrebookingActions(p)
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
            checked={driverDispatchService.selectedItemIds.indexOf(ur.id) > -1}
            onChange={checked => {
              this.handleCheckboxClick(checked, i, ur.id);
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
      driverDispatchService.state.slug === DispatchState.map.prebooking.slug
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

  private get highlightedIndexes(): number[] {
    var array: number[] = [];

    if (driverDispatchService.state.slug === DispatchState.map.forecast.slug) {
      driverDispatchService.forecasts.forEach((f, i) => {
        if (driverDispatchService.selectedItemIds.filter(id => id === f.id).length > 0) {
          array.push(i);
        }
      })
    } else if (driverDispatchService.state.slug === DispatchState.map.prebooking.slug) {
      driverDispatchService.prebookings.forEach((p, i) => {
        if (driverDispatchService.selectedItemIds.filter(id => id === p.id).length > 0) {
          array.push(i);
        }
      })
    } else if (driverDispatchService.state.slug === DispatchState.map.unassignedRoute.slug) {
      driverDispatchService.unassignedRoutes.forEach((ur, i) => {
        if (driverDispatchService.selectedItemIds.filter(id => id === ur.id).length > 0) {
          array.push(i);
        }
      })
    } else if (driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug) {
      driverDispatchService.assignedRoutes.forEach((ar, i) => {
        if (driverDispatchService.selectedItemIds.filter(id => id === ar.id).length > 0) {
          array.push(i);
        }
      })
    }

    return array;
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
            loading={driverDispatchService.loading}
            highlightedRowIndexes={this.highlightedIndexes}
            disabledRowIndexes={this.getDisabledRowIndexes()}
            gridTemplateColumns={this.gridTemplateColumns}
          />
        </PageContentComponent>
      </>
    );
  }
}
