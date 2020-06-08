import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { LoadingOverlay } from "shared/src/webKit";
import { RoutesService } from "../../../services/routesService";
import { Panel } from "../panel";
import { Actions } from "./components/actions/actions";
import { Filters } from "./components/filters/filters";
import { DriverComponent } from "./components/driver/driver";
import "./pushDriversPanel.scss";
import Localization from "shared/src/localization";
import { Log } from "shared/infrastructure";
import { Driver } from "app/model/driver";

export interface PushDriversPanelProps {
  routesService: RoutesService;
  onConfirmClick: () => void;
  onBackClick: () => void;
}

@observer
export class PushDriversPanel extends React.Component<PushDriversPanelProps> {
  public constructor(props: PushDriversPanelProps) {
    super(props);
    this.fetchDrivers();
  }

  @observable private drivers: Driver[] | undefined;
  @observable private selectedDrivers: Driver[] = [];
  @observable private loading = false;
  @observable private message?: string;
  @observable private textFilter: string | undefined;

  public render() {
    const drivers =
      this.drivers &&
      this.drivers
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
            enableConfirm={
              this.selectedDrivers.length > 0 &&
              !this.loading
            }
            onConfirmClick={() => this.onConfirmClick()}
            onBackClick={() => this.props.onBackClick()}
          />

          <Filters
            textFilter={this.textFilter}
            onTextFilterChange={textFilter =>
              this.onTextFilterChange(textFilter)
            }
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
                route={this.props.routesService.selectedRoute!}
                selected={this.selectedDrivers.includes(driver)}
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
          {(!this.drivers || this.loading) && <LoadingOverlay />}
        </div>
      </Panel>
    );
  }

  private async fetchDrivers(): Promise<void> {
    try {
      this.drivers = await this.props.routesService.fetchDriversNearby(this.props.routesService.selectedRoute!);
    } catch (error) {
      this.drivers = [];
      this.loading = false;
      Log.error(Localization.sharedValue("LiveTracking_RouteSplit_CouldNotGetDrivers"), error);
    }
  }

  private onTextFilterChange(textFilter: string | undefined) {
    this.textFilter = textFilter;
  }

  private onDriverSelected(driver: Driver): void {
    let index = this.selectedDrivers.indexOf(driver);
    if (index != -1) {
      this.selectedDrivers.splice(index, 1);
    } else {
      this.selectedDrivers.push(driver);
    }
  }

  private reset() {
    this.loading = false;
    this.selectedDrivers = [];
    // Restart polling, so any pending requests are discarded.
    this.props.routesService.startPolling();
  }

  private async onConfirmClick(): Promise<void> {
    try {
      this.loading = true;

      await this.props.routesService.pushToDrivers(
        this.selectedDrivers,
        this.props.routesService.selectedRoute!,
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
