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
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

interface Props {
  preBookingIds?: string[];
  selectedRoute?: Route;
  onAssigneeSelection(asignee: Driver | PreBooking);
  matchedAssignees: (Driver | PreBooking)[];
  selectedAssignee?: Driver | PreBooking;
}

interface State {
  state: "drivers" | "pre-bookings";
  selectedAssignee?: Driver | PreBooking;
  selectedRoute?: Route;
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
      selectedAssignee: props.selectedAssignee,
      preBookings: [],
      drivers: [],
      selectedRoute: props.selectedRoute
    };
  }

  componentWillReceiveProps(props: Props) {
    if (props.selectedRoute) {
      this.setState({
        selectedRoute: props.selectedRoute,
        selectedAssignee: props.selectedAssignee
      }, () => this.fetchData())
    } else {
      if (!this.props.preBookingIds && (this.state.drivers.length > 0 || this.state.preBookings.length > 0)) {
        this.setState({
          preBookings: [],
          drivers: [],
          selectedAssignee: props.selectedAssignee
        })
      } else {
        this.setState({
          selectedRoute: props.selectedRoute
        })
      }
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className="c-assignRoutes-assignees">
        <InfoBox
          data={this.state.state === "pre-bookings" ?
          [
            { name: "Pre-bookings", value: this.state.preBookings.length }
          ] :
          [
            { name: "Drivers", value: this.state.drivers.length }
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
                  }, () => {
                    if (this.state.selectedRoute) {
                      this.fetchData();
                    }
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
          gridTemplateColumns="min-content auto auto auto"
        />
      </div>
    );
  }

  private async fetchData(): Promise<void> {
    var drivers: Driver[] = [];
    var preBookings: PreBooking[] = [];

    if (this.props.preBookingIds) {
      preBookings = await driverDispatchService.fetchPreBookingsFromIds(
        this.props.preBookingIds
      );
    } else {
      if (this.state.selectedRoute) {
        if (this.state.state === "drivers") {
          var driverResponse = await driverDispatchService.fetchDrivers({
            date: this.state.selectedRoute.startDateTime,
            search: this.state.search ? this.state.search : "",
            period: new DateTimeRange({
              from: this.state.selectedRoute.startDateTime,
              to: this.state.selectedRoute.endDateTime
            }),
            driverIds: []
          });

          if (driverResponse) {
            drivers = driverResponse.drivers;
          }
        } else {
          var preBookingResponse = await driverDispatchService.fetchPreBookings(
            this.state.selectedRoute.startDateTime,
            this.state.selectedRoute.endDateTime,
            this.state.selectedRoute.startDateTime,
            this.state.selectedRoute.endDateTime
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
      search: this.state.search ? this.state.search : "",
      driverIds: []
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
      { key: "phone", content: "phone" },
      { key: "haulier", content: "Haulier" }
    ];
  }

  private assigneePhone(assignee: Driver | PreBooking): JSX.Element {
    if (assignee instanceof Driver) {
      return (
        <a
          href={`tel:${assignee.phone.number}`}>
          {assignee.phone.number}
        </a>
      );
    } else if (assignee instanceof PreBooking) {
      return (
        <a
          href={`tel:${assignee.driver.phone.number}`}>
          {assignee.driver.phone.number}
        </a>
      );
    } else {
      return <></>;
    }
  }

  private assigneeName(assignee: Driver | PreBooking): JSX.Element {
    if (assignee instanceof Driver) {
      return (
        <a
          target="_blank"
          href={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(":id", assignee.id.toString())}>
          {`${assignee.formattedName} (${assignee.id})`}
        </a>
      );
    } else if (assignee instanceof PreBooking) {
      return (
        <a
          target="_blank"
          href={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(":id", assignee.driver.id.toString())}>
          {`${assignee.driver.formattedName} (${assignee.driver.id})`}
        </a>
      );
    } else {
      return <></>;
    }
  }

  private getRows() {
    if (this.state.state === "drivers") {
      var drivers = this.state.drivers.filter(d => this.props.matchedAssignees.filter(a => a.id === d.id).length === 0);
      return drivers.map(d => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputRadioGroup
            radioButtons={[{ value: d.id, headline: "" }]}
            key={d.id}
            onChange={value => {
              if (
                !this.state.selectedAssignee ||
                d.id !== this.state.selectedAssignee.id
              ) {
                this.props.onAssigneeSelection(d);
              }
            }}
            checkedValue={this.state.selectedAssignee instanceof Driver && this.state.selectedAssignee.id}
          />,
          this.assigneeName(d),
          this.assigneePhone(d),
          d.company && d.company.name !== "" ? `${d.company.name} (${d.company.id})` : "--"
        ];
      });
    } else {
      var preBookings = this.state.preBookings.filter(p => this.props.matchedAssignees.filter(a => a.id === p.id).length === 0);
      return preBookings.map(p => {
        return [
          // tslint:disable-next-line: jsx-wrap-multiline
          <InputRadioGroup
            radioButtons={[{ value: p.driver.id, headline: "" }]}
            key={p.id}
            onChange={value => {
              if (
                !this.state.selectedAssignee ||
                p.id !== this.state.selectedAssignee.id
              ) {
                this.props.onAssigneeSelection(p);
              }
            }}
            checkedValue={this.state.selectedAssignee instanceof PreBooking && this.state.selectedAssignee.id}
          />,
          this.assigneeName(p),
          this.assigneePhone(p),
          p.driver.company && p.driver.company.name !== ""
            ? `${p.driver.company.name} (${p.driver.company.id})`
            : "--"
        ];
      });
    }
  }

  private onSearchChange(query: string | undefined) {
    if (this.state.selectedRoute) {
      this.setState({
        search: query
      });
      if (this.state.state === "drivers") {
        this.fetchDrivers(this.state.selectedRoute);
      } else {
        this.fetchPreBookings(this.state.selectedRoute);
      }
    }
  }
}
