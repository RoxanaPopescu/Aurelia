import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import { routeDetailsService } from "./routeDetailsService";
import {
  LoadingInline,
  ErrorInline,
  Button,
  ButtonType
} from "shared/src/webKit";
import Info from "./components/info/info";
import Header from "./components/header/header";
import Metrics from "./components/metrics/metrics";
import Map from "./components/map/map";
import Stops from "./components/stops/stops";
import "./index.scss";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history?: H.History;
}

@observer
export default class RouteDetailsComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.startPolling();
  }

  @observable private error?: Error;

  private async startPolling(): Promise<void> {
    try {
      this.error = undefined;
      await routeDetailsService.startPolling(this.props.match.params.id);
      document.title = Localization.sharedValue("Routes_Details_Title").replace(
        "{slug}",
        routeDetailsService.routeDetails!.slug
      );
    } catch (error) {
      this.error = error;
      document.title = error.name === "not-found-error" ?
        error.message :
        Localization.sharedValue("Error_General");
      routeDetailsService.stopPolling();
    }
  }

  public render() {
    if (this.error) {
      return (
        <ErrorInline description={this.error.message}>
          {this.error.name !== "not-found-error" &&
          <Button onClick={() => this.startPolling()} type={ButtonType.Action}>
            {Localization.sharedValue("Retry")}
          </Button>}
        </ErrorInline>
      );
    } else if (routeDetailsService.loading) {
      return (
        <div className="c-routeDetails">
          <div className="c-routeDetails-container">
            <LoadingInline
              title={Localization.sharedValue("General_Loading")}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="c-routeDetails">
          <div className="c-routeDetails-container">
            <Info service={routeDetailsService} />

            <div className="c-routeDetails-main">
              <Header history={this.props.history} service={routeDetailsService} />
              <Metrics service={routeDetailsService} />
              <Map service={routeDetailsService} />
              <Stops service={routeDetailsService} />
            </div>
          </div>
        </div>
      );
    }
  }

  public componentWillUnmount() {
    routeDetailsService.stopPolling(true);
  }
}
