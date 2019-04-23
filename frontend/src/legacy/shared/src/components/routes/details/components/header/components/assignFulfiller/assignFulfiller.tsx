import React from "react";
import Localization from "shared/src/localization";
import { AbortError } from "shared/src/utillity/abortError";
import { Route } from "shared/src/model/logistics/routes/details";
import { Button, ButtonType, Toast, ToastType, Input, ButtonSize } from "shared/src/webKit";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { routeDispatchService } from "../../../../routeDispatchService";
import { routeDetailsService } from "../../../../routeDetailsService";
import "./assignFulfiller.scss";

const delayAfterAssigning = 10000;

interface Props {
  route: Route;
}

@observer
export default class extends React.Component<Props> {
  @observable private open = false;

  @observable private errorMessage?: string;

  @observable private fulfillers?: Fulfiller[];

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
          {Localization.sharedValue("RouteDetails_AssignFulfiller_Button")}
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
            />

            <div className="c-dropdown-content">
              {!this.fulfillers && (
                <div>
                  {Localization.sharedValue(
                    "RouteDetails_AssignFulfiller_Loading"
                  )}
                </div>
              )}

              {this.fulfillers &&
                this.fulfillers!.filter(
                  f =>
                    f.id.toLowerCase().includes(this.filter || "") ||
                    f.primaryName.toLowerCase().includes(this.filter || "") ||
                    (f.secondaryName &&
                      f.secondaryName.toLowerCase().includes(this.filter || ""))
                ).map(fulfiller => (
                  <div
                    key={fulfiller.id}
                    className="c-dropdown-item"
                    onClick={() =>
                      this.assignFulfiller(this.props.route, fulfiller)
                    }
                  >
                    <div>{fulfiller.companyName}</div>
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
    if (this.open) {
      routeDetailsService.stopPolling();
      setTimeout(() =>
        window.addEventListener("click", this.toggle, { once: true })
      );
      this.fulfillers = await this.getFulfillers();
    } else {
      this.fulfillers = undefined;
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

  private async getFulfillers(): Promise<Fulfiller[] | undefined> {
    try {
      return routeDispatchService.getFulfillers();
    } catch (error) {
      this.errorMessage = Localization.sharedValue(
        "RouteDetails_AssignFulfiller_CouldNotGetList"
      );

      return undefined;
    }
  }

  private async assignFulfiller(
    route: Route,
    fulfiller: Fulfiller
  ): Promise<void> {
    this.assigned = true;
    try {
      await routeDispatchService.assignFulfiller(route, fulfiller);
    } catch (error) {
      this.errorMessage = Localization.sharedValue(
        "RouteDetails_AssignFulfiller_CouldNotAssign"
      );
    }
    this.toggle();
    this.assigned = false;
  }
}
