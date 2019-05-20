import React from "react";
import "./index.scss";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import Filters from "./components/filters/filters";
import Table from "./components/table/table";
import Header from "./components/header/header";
import H from "history";
import { driverDispatchService } from "./driverDispatchService";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

@observer
export default class DriverDispatchComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Drivers_Title");
  }

  componentWillMount() {
    this.handleStateChange();
  }

  componentWillUpdate() {
    this.handleStateChange();
  }

  private handleStateChange() {
    if (this.props.match.params.state === ":state") {
      this.props.history.push(
        FulfillerSubPage.path(FulfillerSubPage.DriverDispatch).replace(
          ":state",
          driverDispatchService.state
        )
      );
    } else if (this.props.match.params.state === "forecasts") {
      driverDispatchService.state = "forecasts";
    } else if (this.props.match.params.state === "preBookings") {
      driverDispatchService.state = "preBookings";
    } else if (this.props.match.params.state === "assignedRoutes") {
      driverDispatchService.state = "assignedRoutes";
    } else if (this.props.match.params.state === "unassignedRoutes") {
      driverDispatchService.state = "unassignedRoutes";
    }

    this.fetchOverviewData();
  }

  private async fetchOverviewData(): Promise<void> {
    await driverDispatchService.fetchOverview();

    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (driverDispatchService.state === "forecasts") {
      driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
    } else if (driverDispatchService.state === "preBookings") {
      driverDispatchService.preBookings = await driverDispatchService.fetchPreBookings();
    }
    // TODO: Assigned and unassigned routes
  }

  render() {
    return (
      <div className="c-driverDispatch-container">
        <Filters
          onStateChange={state => {
            this.props.history.push(
              FulfillerSubPage.path(FulfillerSubPage.DriverDispatch).replace(
                ":state",
                state
              )
            );
          }}
          onFilterChange={() => this.fetchData()}
        />
        <div className="c-driverDispatch-main">
          <Header />
          <Table />
        </div>
      </div>
    );
  }
}
