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
import { Prebooking } from "../models/prebooking";
import PrebookingDialog from "./components/prebookingDialog";
import Dropdown from "./components/dropdown";
import { Button, ButtonType, Toast, ToastType } from "shared/src/webKit";
import { Route } from "shared/src/components/routes/list/models/route";
import { ButtonSize } from '../../../../../../shared/src/webKit/button/index';

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

interface State {
  prebookingDialog?: {
    prebookings: Prebooking[];
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
      this.props.match.params.state === DispatchState.map.prebooking.slug
    ) {
      driverDispatchService.state = new DispatchState("prebooking");
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
    driverDispatchService.selectedItemIds = [];
    driverDispatchService.driverFilters = [];
    driverDispatchService.fulfilleeFilters = [];
    driverDispatchService.haulierFilters = [];
    await driverDispatchService.fetchOverview();

    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (
      driverDispatchService.state.value === DispatchState.map.forecast.value
    ) {
      driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
    } else if (
      driverDispatchService.state.value === DispatchState.map.prebooking.value
    ) {
      driverDispatchService.prebookings = await driverDispatchService.fetchPrebookings();
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
      driverDispatchService.state.slug === DispatchState.map.prebooking.slug
    ) {
      return (
        <Dropdown
          removePrebookingDrivers={() => this.removePrebookingDrivers()}
          assignPrebookingDrivers={() => this.assignPrebookingDrivers()}
        />
      );
    } else if (
      driverDispatchService.state.slug ===
      DispatchState.map.unassignedRoute.slug
    ) {
      return (
        <Button
          disabled={driverDispatchService.selectedItemIds.length === 0}
          onClick={() => this.assignUnassignedRoutes()}
          type={ButtonType.Light}
          size={ButtonSize.Medium}
        >
          {Localization.operationsValue("Dispatch_UnassignedRoutes__Match")}
        </Button>
      );
    } else {
      return undefined;
    }
  }

  private removePrebookingDrivers() {
    let array: Prebooking[] = [];
    driverDispatchService.prebookings.forEach(p => {
      if (driverDispatchService.selectedItemIds.indexOf(p.id) > -1) {
        array.push(p);
      }
    });

    this.setState({
      prebookingDialog: { prebookings: array, state: "remove" }
    });
  }

  private assignUnassignedRoutes() {
    let array: Route[] = [];
    driverDispatchService.unassignedRoutes.forEach(ur => {
      if (driverDispatchService.selectedItemIds.indexOf(ur.id) > -1) {
        array.push(ur);
      }
    });

    this.props.history.push(
      FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
        .replace(":ids", array.map(ur => ur.id).join(","))
        .replace(":origin", "routes")
    );
  }

  private assignPrebookingDrivers() {
    let array: Prebooking[] = [];
    driverDispatchService.prebookings.forEach(p => {
      if (driverDispatchService.selectedItemIds.indexOf(p.id) > -1) {
        array.push(p);
      }
    });

    this.props.history.push(
      FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
        .replace(":ids", array.map(p => p.id).join(","))
        .replace(":origin", "prebookings")
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
        {this.state.prebookingDialog && (
          <PrebookingDialog
            onClose={() => {
              this.setState({ prebookingDialog: undefined });
            }}
            data={this.state.prebookingDialog}
            onRemove={async prebookings => {
              try {
                await driverDispatchService.removePrebooking(
                  prebookings.map(p => p.id)
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
            onPrebookingAction={prebooking => {
              this.setState({
                prebookingDialog: { prebookings: [prebooking] }
              });
            }}
            onUnassignedRouteAction={route => {
              this.props.history.push(
                FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
                  .replace(":ids", route.id)
                  .replace(":origin", "routes")
              );
            }}
          />
        </div>
      </div>
    );
  }
}
