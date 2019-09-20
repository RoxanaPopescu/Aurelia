import React from "react";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import Filters from "../components/filters/filters";
import Table from "../components/table";
import Header from "../components/header";
import H from "history";
import { driverDispatchService, DispatchState } from "../driverDispatchService";
import CreateForecastDialog from "./components/createForecastDialog";
import { Button, Toast } from "shared/src/webKit";
import { Forecast } from "../models/forecast";
import { DateTimeRange } from "../../../../../../shared/src/model/general/dateTimeRange";
import { ToastType } from "../../../../../../shared/src/webKit/toast/index";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../shared/src/webKit/button/index";

interface Props {
  history: H.History;
}

interface State {
  createForecastDialogOpen: boolean;
}

@observer
export default class ForecastsComponent extends React.Component<Props, State> {
  forecasts: {
    forecast: Forecast;
    newTotalSlots: number;
  }[];
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Dispatch_Forecasts_Title");

    driverDispatchService.state = new DispatchState("forecast");
    this.state = {
      createForecastDialogOpen: false
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    driverDispatchService.selectedItemIds = [];
    await driverDispatchService.fetchOverview();

    driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
    this.forecasts = driverDispatchService.forecasts.map(f => {
      return {
        forecast: f,
        newTotalSlots: f.slots.total
      };
    });
  }

  render() {
    return (
      <div className="c-driverDispatch-container">
        {driverDispatchService.toast && (
          <Toast
            type={
              driverDispatchService.toast.type === "error"
                ? ToastType.Alert
                : ToastType.Success
            }
            remove={() => {
              driverDispatchService.toast = undefined;
            }}
          >
            {driverDispatchService.toast.message}
          </Toast>
        )}
        <CreateForecastDialog
          open={this.state.createForecastDialogOpen}
          onClose={() => {
            this.setState({
              createForecastDialogOpen: false
            });
          }}
          onCreate={forecast => {
            try {
              driverDispatchService.createForecast({
                fulfillee: forecast.fulfillee,
                date: forecast.dateFrom,
                timeFrame: new DateTimeRange({
                  from: forecast.dateTimeFrom,
                  to: forecast.dateTimeTo
                }),
                startLocation: forecast.startLocation,
                vehicleTypeId: forecast.vehicleType.toString(),
                slots: forecast.totalSlots
              });

              this.setState({
                createForecastDialogOpen: false
              });

              return true;
            } catch {
              return false;
            }
          }}
        />
        <Filters
          page="forecasts"
          onStateChange={() => {
            /** */
          }}
          onFilterChange={() => this.fetchData()}
          onTopFilterChange={() => {
            this.fetchData();
          }}
        />
        <div className="c-driverDispatch-main">
          <Header>
            <Button
              onClick={async () => {
                this.setState({
                  createForecastDialogOpen: true
                });
              }}
              type={ButtonType.Light}
              size={ButtonSize.Medium}
            >
              {Localization.operationsValue("Dispatch_Forecasts__Create")}
            </Button>
            <Button
              onClick={async () => {
                await driverDispatchService.updateForecasts(this.forecasts);
                driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
              }}
              type={ButtonType.Action}
              size={ButtonSize.Medium}
              disabled={driverDispatchService.forecasts.length === 0}
            >
              {Localization.operationsValue("Dispatch_Forecasts__UpdateAll")}
            </Button>
          </Header>
          <Table
            onForecastEnter={async (forecast, newValue) => {
              await driverDispatchService.updateForecasts([
                { forecast: forecast, newTotalSlots: newValue }
              ]);
              driverDispatchService.fetchForecasts();
            }}
            onForecastChange={(forecast, newValue) => {
              this.forecasts = this.forecasts.map(f => {
                if (f.forecast.id === forecast.id) {
                  return { forecast: forecast, newTotalSlots: newValue };
                } else {
                  return f;
                }
              });
            }}
            page="forecasts"
          />
        </div>
      </div>
    );
  }
}
