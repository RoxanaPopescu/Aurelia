import React from "react";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import Filters from "../components/filters/filters";
import Table from "../components/table/table";
import Header from "../components/header/header";
import H from "history";
import { driverDispatchService, DispatchState } from "../driverDispatchService";
import { PreBooking } from "../models/preBooking";
import PreBookingDialog from "../components/preBookingDialog";
import { Button } from "shared/src/webKit";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../shared/src/webKit/button/index";

interface Props {
  history: H.History;
}

interface State {
  preBookingDialog?: {
    preBookings: PreBooking[];
    state?: "actions" | "remove" | "change";
  };
}

@observer
export default class ForecastsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Drivers_Title");

    driverDispatchService.state = new DispatchState("forecast");
    this.state = {};
  }

  componentWillMount() {
    this.fetchOverviewData();
  }

  componentWillUpdate() {
    this.fetchOverviewData();
  }

  private async fetchOverviewData(): Promise<void> {
    driverDispatchService.selectedItemIndexes = [];
    await driverDispatchService.fetchOverview();

    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (
      driverDispatchService.state.value === DispatchState.map.forecast.value
    ) {
      await driverDispatchService.fetchForecasts();
    } else if (
      driverDispatchService.state.value === DispatchState.map.preBooking.value
    ) {
      await driverDispatchService.fetchPreBookings();
    }
    // TODO: Assigned and unassigned routes
  }

  render() {
    return (
      <div className="c-driverDispatch-container">
        {this.state.preBookingDialog && (
          <PreBookingDialog
            onClose={() => {
              this.setState({ preBookingDialog: undefined });
            }}
            data={this.state.preBookingDialog}
          />
        )}
        <Filters
          page="forecasts"
          onStateChange={() => {
            /** */
          }}
          onFilterChange={() => this.fetchData()}
          onTopFilterChange={() => {
            this.fetchOverviewData();
          }}
        />
        <div className="c-driverDispatch-main">
          <Header>
            <Button type={ButtonType.Action} size={ButtonSize.Medium}>
              Update forecasts
            </Button>
          </Header>
          <Table
            onForecastEdit={async (forecast, value) => {
              await driverDispatchService.updateForecast(forecast, value);
              driverDispatchService.fetchForecasts();
            }}
            page="forecasts"
            onPreBookingAction={preBooking => {
              this.setState({
                preBookingDialog: { preBookings: [preBooking] }
              });
            }}
          />
        </div>
      </div>
    );
  }
}
