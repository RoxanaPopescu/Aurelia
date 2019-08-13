import React from "react";
import "./index.scss";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import Filters from "../components/filters/filters";
import Table from "../components/table";
import Header from "../components/header";
import H from "history";
import { driverDispatchService, DispatchState } from "../driverDispatchService";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { PreBooking } from "../models/preBooking";
import PreBookingDialog from "./components/preBookingDialog";
import Dropdown from "./components/dropdown";
import { Button, ButtonType, Toast, ToastType } from "shared/src/webKit";
import { Link } from "react-router-dom";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

interface State {
  preBookingDialog?: {
    preBookings: PreBooking[];
    state?: "actions" | "remove" | "change";
  };
}

@observer
export default class DispatchComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Drivers_Title");

    this.state = {};
  }

  componentWillMount() {
    this.handleStateChange();
  }

  private handleStateChange() {
    if (this.props.match.params.state === ":state") {
      this.props.history.push(
        FulfillerSubPage.path(FulfillerSubPage.DriverDispatch).replace(
          ":state",
          driverDispatchService.state.slug
        )
      );
    } else if (
      this.props.match.params.state === DispatchState.map.forecast.slug
    ) {
      driverDispatchService.state = new DispatchState("forecast");
    } else if (
      this.props.match.params.state === DispatchState.map.preBooking.slug
    ) {
      driverDispatchService.state = new DispatchState("preBooking");
    } else if (
      this.props.match.params.state === DispatchState.map.assignedRoute.slug
    ) {
      driverDispatchService.state = new DispatchState("assignedRoute");
    } else if (
      this.props.match.params.state === DispatchState.map.unassignedRoute.slug
    ) {
      driverDispatchService.state = new DispatchState("unassignedRoute");
    }

    this.fetchOverviewData();
  }

  private async fetchOverviewData(): Promise<void> {
    driverDispatchService.selectedItemIndexes = [];
    await driverDispatchService.fetchOverview();

    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (
      driverDispatchService.state.value === DispatchState.map.forecast.value
    ) {
      driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
    } else if (
      driverDispatchService.state.value === DispatchState.map.preBooking.value
    ) {
      driverDispatchService.preBookings = await driverDispatchService.fetchPreBookings();
    } else if (
      driverDispatchService.state.value ===
      DispatchState.map.unassignedRoute.value
    ) {
      driverDispatchService.unassignedRoutes = await driverDispatchService.fetchUnassignedRoutes();
    } else if (
      driverDispatchService.state.value ===
      DispatchState.map.assignedRoute.value
    ) {
      driverDispatchService.assignedRoutes = await driverDispatchService.fetchAssignedRoutes();
    }
  }

  private get headerElements() {
    if (
      driverDispatchService.state.slug === DispatchState.map.preBooking.slug
    ) {
      return (
        <Dropdown
          removePreBookingDrivers={() => this.removePreBookingDrivers()}
          assignPreBookingDrivers={() => this.assignPreBookingDrivers()}
        />
      );
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return (
        <Link to="">
          <Button type={ButtonType.Light}>Match route</Button>
        </Link>
      );
    } else if (
      driverDispatchService.state.slug === DispatchState.map.assignedRoute.slug
    ) {
      return <Button type={ButtonType.Light}>Delete driver</Button>;
    } else {
      return undefined;
    }
  }

  private removePreBookingDrivers() {
    let array: PreBooking[] = [];
    driverDispatchService.preBookings.forEach((p, i) => {
      if (driverDispatchService.selectedItemIndexes.indexOf(i) > -1) {
        array.push(p);
      }
    });

    this.setState({
      preBookingDialog: { preBookings: array, state: "remove" }
    });
  }

  private assignPreBookingDrivers() {
    let array: PreBooking[] = [];
    driverDispatchService.preBookings.forEach((p, i) => {
      if (driverDispatchService.selectedItemIndexes.indexOf(i) > -1) {
        array.push(p);
      }
    });

    this.props.history.push(
      FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
        .replace(":ids", array.map(p => p.id).join(","))
        .replace(":origin", "pre-bookings")
    );
  }

  render() {
    return (
      <div className="c-driverDispatch-container">
        {driverDispatchService.toast && (
          <Toast
            type={
              driverDispatchService.toast.type === "error"
                ? ToastType.Alert
                : ToastType.Success
            }
            remove={() => {
              driverDispatchService.toast = undefined;
            }}
          >
            {driverDispatchService.toast.message}
          </Toast>
        )}
        {this.state.preBookingDialog && (
          <PreBookingDialog
            onClose={() => {
              this.setState({ preBookingDialog: undefined });
            }}
            data={this.state.preBookingDialog}
            onRemove={async preBookings => {
              try {
                await driverDispatchService.removePreBooking(
                  preBookings.map(p => p.id)
                );
                this.fetchData();
                return true;
              } catch {
                return false;
              }
            }}
          />
        )}
        <Filters
          page="dispatch"
          onStateChange={state => {
            this.props.history.push(
              FulfillerSubPage.path(FulfillerSubPage.DriverDispatch).replace(
                ":state",
                state.slug
              )
            );
            this.handleStateChange();
          }}
          onFilterChange={() => this.fetchData()}
          onTopFilterChange={() => {
            this.fetchOverviewData();
          }}
        />
        <div className="c-driverDispatch-main">
          <Header>{this.headerElements}</Header>
          <Table
            page="dispatch"
            onPreBookingAction={preBooking => {
              this.setState({
                preBookingDialog: { preBookings: [preBooking] }
              });
            }}
            onUnassignedRouteAction={route => {
              this.props.history.push(
                FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
                  .replace(":ids", route.slug)
                  .replace(":origin", "routes")
              );
            }}
          />
        </div>
      </div>
    );
  }
}
