import React from "react";
import "./index.scss";
import { Route } from "shared/src/components/routes/list/models/route";
import { PreBooking } from "../../../models/preBooking";
import { observer } from "mobx-react";
import { driverDispatchService } from "../../../driverDispatchService";
import { Driver } from "shared/src/model/logistics/order/driver";
import { TableComponent, Input, InputRadioGroup } from "shared/src/webKit";
import InfoBox from "../../../components/infoBox";
import Localization from "shared/src/localization";
import { DateTimeRange } from "../../../../../../../../shared/src/model/general/dateTimeRange";

interface Props {
  preBookingIds?: string[];
  selectedRoute?: Route;
  onAssigneeSelection(asignee: Driver | PreBooking);
}

interface State {
  state: "drivers" | "pre-bookings";
  selectedAssignee?: Driver | PreBooking;
  search?: string;
  drivers: Driver[];
  preBookings: PreBooking[];
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      state: "pre-bookings",
      selectedAssignee: undefined,
      preBookings: [],
      drivers: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    var drivers: Driver[] = [];
    var preBookings: PreBooking[] = [];

    if (this.props.preBookingIds) {
      preBookings = await driverDispatchService.fetchPreBookingsFromIds(
        this.props.preBookingIds
      );
    } else {
      if (this.props.selectedRoute) {
        if (this.state.state === "drivers") {
          var driverResponse = await driverDispatchService.fetchDrivers({
            date: this.props.selectedRoute.startDateTime,
            search: this.state.search ? this.state.search : "",
            period: new DateTimeRange({
              from: this.props.selectedRoute.startDateTime,
              to: this.props.selectedRoute.endDateTime
            })
          });

          if (driverResponse) {
            drivers = driverResponse.drivers;
          }
        } else {
          var preBookingResponse = await driverDispatchService.fetchPreBookings(
            this.props.selectedRoute.startDateTime,
            this.props.selectedRoute.endDateTime,
            this.props.selectedRoute.startDateTime,
            this.props.selectedRoute.endDateTime
          );

          if (preBookingResponse.length > 0) {
            preBookings = preBookingResponse;
          }
        }
      }
    }

    this.setState({
      drivers: drivers,
      preBookings: preBookings
    });
  }

  private async fetchDrivers(route: Route): Promise<void> {
    var response = await driverDispatchService.fetchDrivers({
      date: route.startDateTime,
      search: this.state.search ? this.state.search : ""
    });

    if (response) {
      this.setState({
        drivers: response.drivers
      });
    }
  }

  private async fetchPreBookings(route: Route): Promise<void> {
    var response = await driverDispatchService.fetchPreBookings(
      route.startDateTime,
      route.endDateTime,
      route.startDateTime,
      route.endDateTime
    );

    this.setState({
      preBookings: response
    });
  }

  private getHeaders() {
    return [
      {
        key: "select",
        content: ""
      },
      { key: "driver", content: "Driver" },
      { key: "id", content: "Id" },
      { key: "phone", content: "phone" },
      { key: "haulier", content: "Haulier" }
    ];
  }

  private getRows() {
    if (this.state.state === "drivers") {
      return this.state.drivers.map(d => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputRadioGroup
            radioButtons={[{ value: d.id, headline: "" }]}
            key={d.id}
            onChange={value => {
              if (
                !this.state.selectedAssignee ||
                value !== this.state.selectedAssignee.id
              ) {
                var assignee = this.state.drivers.filter(
                  driver => driver.id === value
                )[0];
                this.setState({
                  selectedAssignee: assignee
                });
                this.props.onAssigneeSelection(assignee);
              }
            }}
            checkedValue={this.getSelectedValue()}
          />,
          d.formattedName,
          d.id,
          d.phone.number,
          d.company ? `${d.company.name} (${d.company.id})` : "--"
        ];
      });
    } else {
      return this.state.preBookings.map(p => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputRadioGroup
            radioButtons={[{ value: p.driver.id, headline: "" }]}
            key={p.id}
            onChange={value => {
              if (
                !this.state.selectedAssignee ||
                value !== this.state.selectedAssignee.id
              ) {
                var assignee = this.state.preBookings.filter(
                  preBooking => preBooking.driver.id === value
                )[0];
                this.setState({
                  selectedAssignee: assignee
                });
                this.props.onAssigneeSelection(assignee);
              }
            }}
            checkedValue={this.getSelectedValue()}
          />,
          p.driver.formattedName,
          p.driver.id,
          p.driver.phone.number,
          p.driver.company
            ? `${p.driver.company.name} (${p.driver.company.id})`
            : "--"
        ];
      });
    }
  }

  private getSelectedValue() {
    if (this.state.selectedAssignee) {
      return this.state.selectedAssignee.id;
    } else {
      if (this.state.state === "drivers") {
        if (this.state.drivers.length > 0) {
          return this.state.drivers[0].id;
        }
      } else {
        if (this.state.preBookings.length > 0) {
          return this.state.preBookings[0].driver.id;
        }
      }
    }

    return undefined;
  }

  private onSearchChange(query: string | undefined) {
    if (this.props.selectedRoute) {
      this.setState({
        search: query
      });
      if (this.state.state === "drivers") {
        this.fetchDrivers(this.props.selectedRoute);
      } else {
        this.fetchPreBookings(this.props.selectedRoute);
      }
    }
  }

  render() {
    return (
      <div className="c-assignRoutes-assignees">
        <InfoBox
          data={[
            { name: "Pre-bookings", value: this.state.preBookings.length }
          ]}
        />
        <div className="c-assignRoutes-assigneeState">
          <Input
            className="c-createPreBooking-search"
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
          {!this.props.preBookingIds && (
            <InputRadioGroup
              radioButtons={[
                { value: "pre-bookings", headline: "Pre-bookings" },
                { value: "drivers", headline: "Drivers" }
              ]}
              onChange={value => {
                if (value !== this.state.state) {
                  this.setState({
                    state: value
                  });
                }
              }}
              checkedValue={this.state.state}
            />
          )}
        </div>
        <TableComponent
          newVersion={true}
          data={{
            headers: this.getHeaders(),
            rows: this.getRows()
          }}
          gridTemplateColumns="min-content auto auto auto auto"
        />
      </div>
    );
  }
}
