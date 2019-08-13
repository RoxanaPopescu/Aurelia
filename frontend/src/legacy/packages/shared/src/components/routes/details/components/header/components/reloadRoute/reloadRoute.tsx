import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Route } from "shared/src/model/logistics/routes/details";
import { Button, ButtonType, Toast, ToastType, ButtonSize } from "shared/src/webKit";
import { routeService } from "../../../../routeService";

interface Props {
  route: Route;
}

@observer
export default class extends React.Component<Props> {

  @observable private errorMessage?: string;

  public render() {
    return (
      <>
        <Button
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => this.reloadRoute()}
        >
          {Localization.sharedValue("RouteDetails_ReloadRoute")}
        </Button>

        {this.errorMessage && (
          <Toast
            type={ToastType.Alert}
            remove={() => (this.errorMessage = undefined)}
          >
            {this.errorMessage}
          </Toast>
        )}
      </>
    );
  }

  private async reloadRoute(): Promise<void> {
    if (!confirm("Genindlæse ruten i chaufførens app?")) {
      return;
    }
    try {
      await routeService.reloadRouteInApp(this.props.route.id);
    } catch (error) {
      this.errorMessage = Localization.sharedValue(
        "RouteDetails_SetStatus_CouldNotReloadRoute"
      );
    }
  }
}
