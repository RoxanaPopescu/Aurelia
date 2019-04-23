import React from "react";
import Localization from "shared/src/localization";
import { AbortError } from "shared/src/utillity/abortError";
import { Route } from "shared/src/model/logistics/routes/details";
import { Button, ButtonType, Toast, ToastType, Input, ButtonSize } from "shared/src/webKit";
import { observable } from "mobx";
import { observer } from "mobx-react";
import {
  routeDispatchService,
  DriverInfo
} from "../../../../routeDispatchService";
import { Driver } from "shared/src/model/logistics/driver";
import { routeDetailsService } from "../../../../routeDetailsService";
import "./assignDriver.scss";

const delayAfterAssigning = 60000;

interface Props {
  route: Route;
}

@observer
export default class extends React.Component<Props> {
  @observable private open = false;

  @observable private errorMessage?: string;

  @observable private drivers?: DriverInfo[];

  @observable private filter?: string;

  @observable private assigned = false;

  public render() {
    return (
      <div className="c-dropdown">
        {this.errorMessage && (
          <Toast
            type={ToastType.Alert}
            remove={() => (this.errorMessage = undefined)}
          >
            {this.errorMessage}
          </Toast>
        )}

        <Button
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          className={`c-dropdown-button ${this.open ? "expanded" : ""}`}
          onClick={() => this.toggle()}
          disabled={this.assigned || !this.props.route.allowAssignment}
        >
          {Localization.sharedValue("RouteDetails_AssignDriver_Button")}
        </Button>

        {this.open && (
          <div
            className={`c-dropdown-panel ${
              this.assigned ? "c-dropdown-panel--disabled" : ""
            }`}
            onClick={e => e.nativeEvent.stopPropagation()}
          >
            <Input
              className="c-dropdown-filter"
              placeholder="Filter"
              onChange={text => (this.filter = (text || "").toLowerCase())}
              value={this.filter}
              ref={e => e && e.input.focus()}
            />

            <div className="c-dropdown-content">
              {!this.drivers && (
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_AssignDriver_Loading"
                  )}
                </div>
              )}

              {this.drivers &&
                this.drivers!.filter(
                  d =>
                    d.driver.id
                      .toString()
                      .toLowerCase()
                      .includes(this.filter || "") ||
                    d.driver.name
                      .toString()
                      .toLowerCase()
                      .includes(this.filter || "") ||
                    d.vehicleTypes.some(vt =>
                      vt.name.toLowerCase().includes(this.filter || "")
                    )
                ).map(d => (
                  <div
                    key={d.driver.id}
                    className="c-dropdown-item"
                    onClick={() =>
                      this.assignDriver(this.props.route, d.driver)
                    }
                  >
                    <div className="c-routeDetails-assignDriver-driver-id">
                      {d.driver.id}
                    </div>
                    <div>{d.driver.name.toString()}</div>
                    <div className="c-routeDetails-assignDriver-driver-vehicleTypes">
                      {d.vehicleTypes.map(vt => vt.name).join(", ")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  private toggle = async () => {
    this.open = !this.open;
    this.filter = "";
    if (this.open) {
      setTimeout(() =>
        window.addEventListener("click", this.toggle, { once: true })
      );
      routeDetailsService.stopPolling();
      this.drivers = await this.getDrivers(this.props.route.vehicleType.id);
    } else {
      this.drivers = undefined;
      window.removeEventListener("click", this.toggle);
      try {
        await routeDetailsService.startPolling(undefined, delayAfterAssigning);
      } catch (error) {
        if (!(error instanceof AbortError)) {
          throw error;
        }
      }
    }
  }

  private async getDrivers(
    vehicleTypeId: string
  ): Promise<DriverInfo[] | undefined> {
    try {
      const drivers = await routeDispatchService.getDrivers(vehicleTypeId);
      return this.sortDrivers(drivers, vehicleTypeId);
    } catch (error) {
      this.errorMessage = this.errorMessage = Localization.sharedValue(
        "RouteDetails_AssignDriver_CouldNotGetList"
      );

      return undefined;
    }
  }

  private sortDrivers(
    drivers: DriverInfo[],
    vehicleTypeId: string
  ): DriverInfo[] {
    for (const driver of drivers) {
      driver.vehicleTypes.sort((a, b) => {
        return a.id === vehicleTypeId
          ? -1
          : a.maxWeight < b.maxWeight
            ? -1
            : a.maxWeight > b.maxWeight
              ? 1
              : 0;
      });
    }
    return drivers.sort((a, b) => {
      return a.vehicleTypes[0].id === vehicleTypeId
        ? -1
        : a.vehicleTypes[0].maxWeight < b.vehicleTypes[0].maxWeight
          ? -1
          : a.vehicleTypes[0].maxWeight > b.vehicleTypes[0].maxWeight
            ? 1
            : 0;
    });
  }

  private async assignDriver(route: Route, driver: Driver): Promise<void> {
    this.assigned = true;
    try {
      await routeDispatchService.assignDriver(route, driver);
    } catch (error) {
      this.errorMessage = Localization.sharedValue(
        "RouteDetails_AssignDriver_CouldNotAssign"
      );
    }
    this.toggle();
    this.assigned = false;
  }
}
