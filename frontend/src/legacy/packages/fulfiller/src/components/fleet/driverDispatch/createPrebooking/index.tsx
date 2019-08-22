import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import H from "history";
import {
  TableComponent,
  Button,
  InputCheckbox,
  Input,
  Toast,
  ToastType
} from "shared/src/webKit";
import { Forecast } from "../models/forecast";
import InfoBox from "../components/infoBox";
import { PageHeaderComponent } from "../../../../../../shared/src/components/pageHeader/index";
import { FulfillerSubPage } from "../../../navigation/page";
import Localization from "shared/src/localization";
import { driverDispatchService } from "../driverDispatchService";
import { Driver } from "shared/src/model/logistics/order/driver";
import { PageContentComponent } from "shared/src/components/pageContent";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../shared/src/webKit/button/index";
import { OverviewData } from "../models/overviewData";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

interface State {
  id?: string;
  drivers: Driver[];
  forecast?: Forecast;
  search?: string;
  checkedDrivers: Driver[];
}

@observer
export default class CreatePrebookingComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    document.title = "Assign drivers to forecast";

    this.state = {
      id: this.props.match.params.id,
      drivers: [],
      checkedDrivers: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (this.state.id) {
      var forecast = await driverDispatchService.fetchForecast(this.state.id);
      var driverResult:
        | { drivers: Driver[]; totalCount: number }
        | undefined = {
        drivers: [],
        totalCount: 0
      };

      if (forecast) {
        driverResult = await this.fetchDrivers(forecast);
      }

      this.setState({
        drivers: driverResult ? driverResult.drivers : [],
        forecast: forecast
      });
    }
  }

  private async fetchDrivers(
    forecast: Forecast,
    query?: string
  ): Promise<{ drivers: Driver[]; totalCount: number } | undefined> {
    return await driverDispatchService.fetchDrivers({
      date: forecast.date,
      search: query ? query : "",
      driverIds: [],
      period: forecast.timePeriod
    });
  }

  private async createPrebookings(saveAndClose?: boolean) {
    if (this.state.forecast && this.state.checkedDrivers.length > 0) {
      await driverDispatchService.createPrebookings(
        this.state.forecast,
        this.state.checkedDrivers
      );

      if (saveAndClose) {
        this.props.history.push(
          FulfillerSubPage.path(FulfillerSubPage.DriverDispatch)
        );
      } else {
        this.setState({
          checkedDrivers: [],
          drivers: [],
          forecast: undefined
        });

        this.fetchData();
      }
    }
  }

  private renderForecastInfo(forecast?: Forecast) {
    return (
      <div className="c-createPrebooking-forecastInfo">
        <div className="c-createPrebooking-infoContainer">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../assets/icons/company.svg")}
          />
          <h4>{`${forecast ? forecast.fulfillee.name : "--"}, ${
            forecast ? forecast.startingLocation.address.primary : "--"
          }`}</h4>
        </div>
        <div className="c-createPrebooking-infoContainer">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../assets/icons/calendar.svg")}
          />
          <h4>{forecast ? Localization.formatDate(forecast.date) : "--"}</h4>
        </div>
        <div className="c-createPrebooking-infoContainer">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../assets/icons/watch.svg")}
          />
          <h4>
            {forecast
              ? Localization.formatDateRange(forecast.timePeriod)
              : "--"}
          </h4>
        </div>
        <div className="c-createPrebooking-infoContainer">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../assets/icons/van.svg")}
          />
          <h4>{forecast ? forecast.vehicleType.name : "--"}</h4>
        </div>
      </div>
    );
  }

  private getHeaders() {
    return [
      {
        key: "select",
        content: (
          <InputCheckbox
            readonly={
              this.state.forecast &&
              this.state.forecast.slots.total -
                this.state.forecast.slots.assigned <=
                this.state.drivers.length
            }
            checked={
              this.state.drivers.length !== 0 &&
              this.state.checkedDrivers.length === this.state.drivers.length
            }
            onChange={checked => {
              var checkedRows: Driver[] = [];
              if (checked) {
                this.state.drivers.forEach(d => {
                  checkedRows.push(d);
                });
              }

              this.setState({
                checkedDrivers: checkedRows
              });
            }}
          />
        )
      },
      { key: "name", content: "Name" },
      { key: "phone", content: "Phone" },
      { key: "driver-id", content: "id" },
      { key: "haulier", content: "Haulier" }
    ];
  }

  private getRows() {
    return this.state.drivers.map(d => {
      return [
        // tslint:disable-next-line: jsx-wrap-multiline
        <InputCheckbox
          checked={
            this.state.checkedDrivers.filter(cd => cd.id === d.id).length > 0
          }
          onChange={checked => {
            var checkedRows = this.state.checkedDrivers;
            var unassignedSlots =
              this.state.forecast!.slots.total -
              this.state.forecast!.slots.assigned;
            if (
              checked &&
              this.state.checkedDrivers.length < unassignedSlots &&
              this.state.checkedDrivers.filter(cd => cd.id === d.id).length ===
                0
            ) {
              checkedRows.push(d);
            } else {
              checkedRows = checkedRows.filter(cr => cr.id !== d.id);
            }
            this.setState({
              checkedDrivers: checkedRows
            });
          }}
          key={d.id}
        />,
        // tslint:disable-next-line: jsx-wrap-multiline
        <a
          key={d.id}
          target="_blank"
          href={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(
            ":id",
            d.id.toString()
          )}
        >
          {d.formattedName}
        </a>,
        d.phone.number,
        d.id.toString(),
        d.company && d.company.name !== "" ? `${d.company.name} (${d.company.id})` : "--"
      ];
    });
  }

  private async onSearchChange(query: string | undefined) {
    if (this.state.forecast) {
      this.setState({
        search: query
      });

      var response = await this.fetchDrivers(this.state.forecast, query);

      this.setState({
        drivers: response ? response.drivers : []
      })
    }
  }

  private get disabledRows(): number[] {
    let array: number[] = [];
    if (this.state.forecast) {
      if (
        this.state.forecast.slots.total - this.state.forecast.slots.assigned ===
        this.state.checkedDrivers.length
      ) {
        array = this.state.drivers
          .map((d, i) => i)
          .filter(
            d => !this.state.checkedDrivers.map((cd, i) => i).includes(d)
          );
      }
    }

    return array;
  }

  private get infoBoxData() {
    return [
      new OverviewData(
        "Total slots",
        this.state.forecast ? this.state.forecast.slots.total : "--"
      ),
      new OverviewData(
        "Unassigned slots",
        this.state.forecast
          ? `${this.state.forecast.slots.total -
              this.state.forecast.slots.assigned}`
          : "--"
      ),
      new OverviewData(
        "Selected drivers",
        `${this.state.checkedDrivers.length}`
      )
    ];
  }

  render() {
    return (
      <div className="c-createPrebooking-container">
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
        <PageHeaderComponent
          path={[
            {
              title: "Disponering",
              href: FulfillerSubPage.path(FulfillerSubPage.DriverDispatch)
            },
            { title: "Assign drivers to forecast" }
          ]}
        >
          <div
            onClick={() => {
              this.props.history.goBack();
            }}
            className="c-createPrebooking-closeButton"
          />
          {this.renderForecastInfo(this.state.forecast)}
          <InfoBox data={this.infoBoxData} />
          <Input
            className="c-createPrebooking-search"
            headline="Search for specific drivers"
            placeholder={Localization.sharedValue("Search_TypeToSearch")}
            onChange={(value, event) => {
              if (event) {
                event.persist();
              }

              this.onSearchChange(value);
            }}
            value={this.state.search}
          />
        </PageHeaderComponent>
        <PageContentComponent className="c-createPrebooking-content">
          <TableComponent
            newVersion={true}
            data={{
              headers: this.getHeaders(),
              rows: this.getRows()
            }}
            gridTemplateColumns="min-content auto auto auto auto"
            highlightedRowIndexes={this.state.checkedDrivers.map((d, i) => i)}
            disabledRowIndexes={this.disabledRows}
          />
        </PageContentComponent>
        <div className="c-createPrebooking-saveContainer">
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Medium}
            onClick={() => {
              this.createPrebookings();
            }}
          >
            Save
          </Button>
          <Button
            type={ButtonType.Action}
            size={ButtonSize.Medium}
            onClick={() => {
              this.createPrebookings(true);
            }}
          >
            Save and close
          </Button>
        </div>
      </div>
    );
  }
}
