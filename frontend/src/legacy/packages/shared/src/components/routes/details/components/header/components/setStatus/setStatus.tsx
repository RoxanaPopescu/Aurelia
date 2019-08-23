import React from "react";
import Localization from "shared/src/localization";
import { AbortError } from "shared/src/utillity/abortError";
import { Route } from "shared/src/model/logistics/routes/details";
import { Button, ButtonType, Toast, ToastType, ButtonSize } from "shared/src/webKit";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { routeService } from "../../../../routeService";
import { routeDetailsService } from "../../../../routeDetailsService";

const delayAfterAssigning = 100;

interface Props {
  route: Route;
}

@observer
export default class extends React.Component<Props> {

  @observable private open = false;

  @observable private errorMessage?: string;

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
        >
          {Localization.sharedValue("RouteDetails_SetStatus_Button")}
        </Button>

        {this.open && (
          <div
            className={"c-dropdown-panel"}
            onClick={e => e.nativeEvent.stopPropagation()}
          >
            <div className="c-dropdown-content">

                  {!["requested", "assigned"].includes(this.props.route.status.slug) &&
                  <div
                    className="c-dropdown-item"
                    onClick={() => this.setStatus("not-started")}
                  >
                    Ikke startet
                  </div>}

                  {!["requested", "started"].includes(this.props.route.status.slug) &&
                  <div
                    className="c-dropdown-item"
                    onClick={() => this.setStatus("started")}
                  >
                    Startet
                  </div>}

                  {!["completed"].includes(this.props.route.status.slug) &&
                  <div
                    className="c-dropdown-item"
                    onClick={() => this.setStatus("completed")}
                  >
                    Færdig
                  </div>}

                  {!["cancelled"].includes(this.props.route.status.slug) &&
                  <div
                    className="c-dropdown-item"
                    onClick={() => this.setStatus("cancelled")}
                  >
                    Anulleret
                  </div>}

            </div>
          </div>
        )}
      </div>
    );
  }

  private toggle = async () => {
    this.open = !this.open;
    if (this.open) {
      setTimeout(() =>
        window.addEventListener("click", this.toggle, { once: true })
      );
      routeDetailsService.stopPolling();
    } else {
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

  private async setStatus(status: string): Promise<void> {
    try {
      await routeService.setStatus(this.props.route.id, status);
    } catch (error) {
      this.errorMessage = Localization.sharedValue(
        "RouteDetails_SetStatus_CouldNotSetStatus"
      );
    }
    this.toggle();
  }
}
