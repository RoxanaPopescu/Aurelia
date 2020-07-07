import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { LoadingOverlay } from "shared/src/webKit";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { Panel } from "../panel";
import { Actions } from "./components/actions/actions";
import { Filters } from "./components/filters/filters";
import { DriverComponent } from "./components/driver/driver";
import "./driversPanel.scss";
import Localization from "shared/src/localization";
import { Log } from "shared/infrastructure";
import { Driver } from "app/model/driver";
import BaseService from "shared/src/services/base";

export interface DriversPanelProps {
  service: LiveTrackingService;
  onConfirmClick: () => void;
  onBackClick: () => void;
}

@observer
export class DriversPanel extends React.Component<DriversPanelProps> {
  public constructor(props: DriversPanelProps) {
    super(props);
    this.fetchDrivers();
  }

  @observable private loading = false;
  @observable private message?: string;
  @observable private textFilter: string | undefined;

  public render() {
    const drivers =
      this.props.service.drivers &&
      this.props.service.drivers
        .filter(
          driver =>
            !this.textFilter ||
            driver.name.toString()
              .toString()
              .toLowerCase()
              .includes(this.textFilter.toLowerCase())
        );

    return (
      <Panel className="c-liveTracking-pushDriversPanel">
        <div className="c-liveTracking-panel-header">
          <Actions
            enablePush={
              this.props.service.selectedDrivers.length > 0 &&
              !this.loading
            }
            showPush={this.props.service.selectedRoute!.driver == null}
            enableAssign={
              this.props.service.selectedDrivers.length == 1 &&
              !this.loading
            }
            onPushClick={() => this.onPushClick()}
            onAssignClick={() => this.onAssignClick()}
            onBackClick={() => {
              this.props.service.drivers = undefined;
              this.props.service.selectedDrivers = [];
              this.props.onBackClick();
            }}
          />

          <Filters
            textFilter={this.textFilter}
            onTextFilterChange={textFilter =>
              this.onTextFilterChange(textFilter)
            }
            showPush={this.props.service.selectedRoute!.driver == null}
            message={this.message}
            onMessageChange={m =>
              this.message = m
            }
          />
        </div>

        <div className="c-liveTracking-panel-body">
          {drivers &&
            drivers.map(driver => (
              <DriverComponent
                key={driver.id}
                driver={driver}
                route={this.props.service.selectedRoute!}
                selected={this.props.service.selectedDrivers.includes(driver)}
                onClick={() => this.onDriverSelected(driver)}
              />
            ))}

          {drivers &&
            drivers.length === 0 && (
              <div className="c-liveTracking-pushDriversPanel-noDriversFound">
                {Localization.sharedValue(
                  "LiveTracking_RouteSplit_NoDriversFound"
                )}
              </div>
            )}
          {(!this.props.service.drivers || this.loading) && <LoadingOverlay />}
        </div>
      </Panel>
    );
  }

  private async fetchDrivers(): Promise<void> {
    try {
      this.props.service.drivers = await this.props.service.fetchDriversNearby(this.props.service.selectedRoute!);
    } catch (error) {
      this.props.service.drivers = [];
      this.loading = false;
      Log.error(Localization.sharedValue("LiveTracking_RouteSplit_CouldNotGetDrivers"), error);
    }
  }

  private onTextFilterChange(textFilter: string | undefined) {
    this.textFilter = textFilter;
  }

  private onDriverSelected(driver: Driver): void {
    this.props.service.onSelectDriver(driver);
  }

  private reset() {
    this.loading = false;
    this.props.service.drivers = undefined;
    this.props.service.selectedDrivers = [];
  }

  private async onAssignClick(): Promise<void> {
    try {
      this.loading = true;

      var url = "dispatch/route/assigndriver";

      const response = await fetch(
        BaseService.url(url),
        BaseService.defaultConfig({
          routeId: this.props.service.selectedRoute!.id,
          driverId: this.props.service.selectedDrivers[0].id
        })
      );

      if (!response.ok) {
        throw new Error(Localization.sharedValue("Error_General"));
      }

      this.reset();
      this.props.onBackClick();
    } catch (error) {
      Log.error(
        Localization.sharedValue("LiveTracking_PushRoute_Failed"),
        error
      );
    }
  }

  private async onPushClick(): Promise<void> {
    try {
      this.loading = true;

      await this.props.service.pushToDrivers(
        this.props.service.selectedDrivers,
        this.props.service.selectedRoute!,
        this.message
      )

      Log.info(
        Localization.operationsValue("LiveTracking_PushToDrivers_Success")
      );

      this.reset();
      this.props.onBackClick();
    } catch (error) {
      Log.error(
        Localization.sharedValue("LiveTracking_PushRoute_Failed"),
        error
      );
    }
  }

}
