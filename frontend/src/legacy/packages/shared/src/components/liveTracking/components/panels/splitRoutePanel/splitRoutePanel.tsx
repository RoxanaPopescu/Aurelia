import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { LoadingOverlay } from "shared/src/webKit";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import {
  RouteSplitService,
  DriverInfo
} from "../../../services/routeSplitService";
import { Panel } from "../panel";
import { Actions } from "./components/actions/actions";
import { RouteInfo } from "./components/routeInfo/routeInfo";
import { Filters } from "./components/filters/filters";
import { Driver } from "./components/driver/driver";
import "./splitRoutePanel.scss";
import Localization from "shared/src/localization";
import { Log } from "shared/infrastructure";
import { RouteStop } from "app/model/route";
import { VehicleType } from "app/model/vehicle";

export interface SplitRoutePanelProps {
  service: LiveTrackingService;
  selectedStops: RouteStop[];
  onConfirmSplitClick: () => void;
  onBackClick: () => void;
}

@observer
export class SplitRoutePanel extends React.Component<SplitRoutePanelProps> {
  public constructor(props: SplitRoutePanelProps) {
    super(props);
    this.routeSplitService = new RouteSplitService();
    this.fetchDrivers();
  }

  private routeSplitService: RouteSplitService;

  @observable private drivers: DriverInfo[] | undefined;

  @observable private selectedDriverInfo: DriverInfo | undefined;
  @observable private selectedVehicleType: VehicleType | undefined;
  @observable private splittingRoute = false;
  @observable private textFilter: string | undefined;

  public render() {
    const selectedRoute = this.props.service.selectedRoute!;

    const drivers =
      this.drivers &&
      this.drivers
        .filter(driverInfo => driverInfo.vehicleTypes.length > 0)
        .filter(
          driverInfo =>
            !this.textFilter ||
            driverInfo.driver.name
              .toString()
              .toLowerCase()
              .includes(this.textFilter.toLowerCase())
        )
        .filter(
          driverInfo =>
            !this.selectedVehicleType ||
            driverInfo.vehicleTypes.some(
              vt => vt.id === this.selectedVehicleType!.id
            )
        );

    return (
      <Panel className="c-liveTracking-splitRoutePanel">
        <div className="c-liveTracking-panel-header">
          <Actions
            enableConfirmSplit={
              this.selectedDriverInfo != null &&
              this.selectedVehicleType != null &&
              !this.splittingRoute
            }
            onConfirmSplitClick={() => this.onConfirmSplitClick()}
            onBackClick={() => this.props.onBackClick()}
          />

          <RouteInfo
            route={selectedRoute}
            selectedVehicleType={this.selectedVehicleType}
            selectedDriverInfo={this.selectedDriverInfo}
            selectedStops={this.props.selectedStops}
          />

          <Filters
            vehicleType={this.selectedVehicleType}
            textFilter={this.textFilter}
            onVehicleTypeChange={vehicleType =>
              this.onVehicleTypeChange(vehicleType)
            }
            onTextFilterChange={textFilter =>
              this.onTextFilterChange(textFilter)
            }
          />
        </div>

        <div className="c-liveTracking-panel-body">
          {drivers &&
            drivers.map(driverInfo => (
              <Driver
                key={driverInfo.driver.id}
                driverInfo={driverInfo}
                selected={driverInfo === this.selectedDriverInfo}
                onClick={() => this.onDriverSelected(driverInfo)}
              />
            ))}

          {drivers &&
            drivers.length === 0 && (
              <div className="c-liveTracking-splitRoutePanel-noDriversFound">
                {Localization.sharedValue(
                  "LiveTracking_RouteSplit_NoDriversFound"
                )}
              </div>
            )}
          {(!this.drivers || this.splittingRoute) && <LoadingOverlay />}
        </div>
      </Panel>
    );
  }

  private async fetchDrivers(): Promise<void> {
    try {
      this.drivers = await this.routeSplitService.getDrivers();
    } catch (error) {
      Log.error(Localization.sharedValue("LiveTracking_RouteSplit_CouldNotGetDrivers"), error);
    }
  }

  private onVehicleTypeChange(vehicleType: VehicleType): void {
    this.selectedVehicleType = vehicleType;
    if (
      this.selectedDriverInfo &&
      !this.selectedDriverInfo.vehicleTypes.includes(vehicleType)
    ) {
      this.selectedDriverInfo = undefined;
    }
  }

  private onTextFilterChange(textFilter: string | undefined) {
    this.textFilter = textFilter;
  }

  private onDriverSelected(driverInfo: DriverInfo): void {
    this.selectedDriverInfo = driverInfo;

    const resetVehicleType =
      this.selectedVehicleType != null &&
      !this.selectedDriverInfo.vehicleTypes.some(
        vt => vt.id === this.selectedVehicleType!.id
      );

    if (resetVehicleType) {
      this.selectedVehicleType = undefined;
    }
  }

  private reset() {
    this.splittingRoute = false;
    this.selectedDriverInfo = undefined;
    this.selectedVehicleType = undefined;
  }

  private async onConfirmSplitClick(): Promise<void> {
    try {
      this.splittingRoute = true;

      await this.routeSplitService.splitRoute(
        this.props.service.selectedRoute!,
        this.selectedVehicleType!.id,
        this.selectedDriverInfo!.driver.id,
        this.props.selectedStops.map(s => s.id)
      );

      Log.info(
        Localization.operationsValue("LiveTracking_RouteSplit_Success")
          .replace(
            "{stops}",
            Localization.formatIntegersAsRanges(
              this.props.selectedStops.map(s => s.stopNumber)
            )
          )
          .replace("{driver}", this.selectedDriverInfo!.driver.name.toString())
      );

      this.reset();
      this.props.onBackClick();
    } catch (error) {
      Log.error(
        Localization.sharedValue("LiveTracking_RouteSplit_CouldNotSplitRoute"),
        error
      );
    }
  }
}
