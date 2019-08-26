import React from "react";
import "./index.scss";
import { Route } from "shared/src/components/routes/list/models/route";
import { Prebooking } from "../../../models/prebooking";
import { observer } from "mobx-react";
import { driverDispatchService } from "../../../driverDispatchService";
import { Driver } from "shared/src/model/logistics/order/driver";
import { TableComponent, Input, InputRadioGroup } from "shared/src/webKit";
import InfoBox from "../../../components/infoBox";
import Localization from "shared/src/localization";
import { DateTimeRange } from "../../../../../../../../shared/src/model/general/dateTimeRange";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

interface Props {
  prebookingIds?: string[];
  selectedRoute?: Route;
  onAssigneeSelection(asignee: Driver | Prebooking);
  matchedAssignees: (Driver | Prebooking)[];
  selectedAssignee?: Driver | Prebooking;
}

interface State {
  state: "drivers" | "prebookings";
  selectedAssignee?: Driver | Prebooking;
  selectedRoute?: Route;
  search?: string;
  drivers: Driver[];
  prebookings: Prebooking[];
  queriedPrebookings: Prebooking[];
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      state: "prebookings",
      selectedAssignee: props.selectedAssignee,
      prebookings: [],
      queriedPrebookings: [],
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
      if (!this.props.prebookingIds && (this.state.drivers.length > 0 || this.state.prebookings.length > 0)) {
        this.setState({
          prebookings: [],
          queriedPrebookings: [],
          drivers: [],
          selectedAssignee: props.selectedAssignee
        })
      } else {
        this.setState({
          selectedAssignee: props.selectedAssignee
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
          data={this.state.state === "prebookings" ?
          [
            { name: Localization.operationsValue("Dispatch_Prebookings"), value: this.state.prebookings.length }
          ] :
          [
            { name: Localization.operationsValue("Drivers_Title"), value: this.state.drivers.length }
          ]}
        />
        <div className="c-assignRoutes-assigneeState">
          <Input
            className="c-assignRoutes-search"
            headline={this.state.state === "drivers" ?
                        Localization.operationsValue("Dispatch_AssignRoutes_SearchDrivers") :
                        Localization.operationsValue("Dispatch_AssignRoutes_SearchPrebookings")}
            placeholder={this.props.prebookingIds ?
                          Localization.operationsValue("Dispatch_AssignRoutes_SearchHint") :
                          Localization.sharedValue("Search_TypeToSearch")}
            onChange={(value, event) => {
              if (event) {
                event.persist();
              }

              this.onSearchChange(value);
            }}
            value={this.state.search}
          />
          {!this.props.prebookingIds && (
            <InputRadioGroup
              radioButtons={[
                { value: "prebookings", headline: Localization.operationsValue("Dispatch_Prebookings") },
                { value: "drivers", headline: Localization.operationsValue("Drivers_Title") }
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
          loading={driverDispatchService.loading}
          gridTemplateColumns={this.props.prebookingIds ? "min-content auto auto auto auto auto" : "min-content auto auto auto"}
        />
      </div>
    );
  }

  private async fetchData(): Promise<void> {
    var drivers: Driver[] = [];
    var prebookings: Prebooking[] = [];

    if (this.props.prebookingIds) {
      prebookings = await driverDispatchService.fetchPrebookingsFromIds(
        this.props.prebookingIds
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
          var prebookingResponse = await driverDispatchService.fetchPrebookings(
            this.state.selectedRoute.startDateTime,
            this.state.selectedRoute.endDateTime,
            this.state.selectedRoute.startDateTime,
            this.state.selectedRoute.endDateTime
          );

          if (prebookingResponse.length > 0) {
            prebookings = prebookingResponse;
          }
        }
      }
    }

    this.setState({
      drivers: drivers,
      prebookings: prebookings,
      queriedPrebookings: prebookings
    }, () => {
      if (this.state.search) {
       this.onSearchChange(this.state.search);
      }
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

  private async fetchDriverById(id: number): Promise<void> {
    var driver = await driverDispatchService.fetchDriverById(id);

    this.setState({
      drivers: driver ? [driver] : []
    });
  }

  private getHeaders() {
    if (this.props.prebookingIds) {
      return [
        {
          key: "select",
          content: ""
        },
        { key: "customer", content: Localization.sharedValue("User_Fulfilee") },
        { key: "datetime", content: Localization.operationsValue("Dispatch_DateTime") },
        { key: "start-address", content: Localization.operationsValue("Dispatch_StartingAddress") },
        { key: "driver", content: Localization.sharedValue("User_Driver") },
        { key: "phone", content: Localization.sharedValue("Phone") }
      ];
    } else {
      return [
        {
          key: "select",
          content: ""
        },
        { key: "driver", content: Localization.sharedValue("User_Driver") },
        { key: "phone", content: Localization.sharedValue("Phone") },
        { key: "haulier", content: Localization.sharedValue("Haulier") }
      ];
    }
  }

  private assigneePhone(assignee: Driver | Prebooking): JSX.Element {
    if (assignee instanceof Driver) {
      return (
        <a
          href={`tel:${assignee.phone.number}`}>
          {assignee.phone.number}
        </a>
      );
    } else if (assignee instanceof Prebooking) {
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

  private assigneeName(assignee: Driver | Prebooking): JSX.Element {
    if (assignee instanceof Driver) {
      return (
        <a
          target="_blank"
          href={FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(":id", assignee.id.toString())}>
          {`${assignee.formattedName} (${assignee.id})`}
        </a>
      );
    } else if (assignee instanceof Prebooking) {
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
      var prebookings = this.state.queriedPrebookings.filter(p => this.props.matchedAssignees.filter(a => a.id === p.id).length === 0);
      if (this.props.prebookingIds) {
        return prebookings.map(p => {
          return [
            // tslint:disable-next-line: jsx-wrap-multiline
            <InputRadioGroup
              radioButtons={[{ value: p.id, headline: "" }]}
              key={p.id}
              onChange={value => {
                if (
                  !this.state.selectedAssignee ||
                  p.id !== this.state.selectedAssignee.id
                ) {
                  this.props.onAssigneeSelection(p);
                }
              }}
              checkedValue={this.state.selectedAssignee instanceof Prebooking && this.state.selectedAssignee.id}
            />,
            p.forecast.fulfillee.name,
            Localization.formatDateTimeRange(p.forecast.timePeriod),
            p.forecast.startingLocation.address.formattedString(),
            this.assigneeName(p),
            this.assigneePhone(p)
          ];
        });
      } else {
        return prebookings.map(p => {
          return [
            // tslint:disable-next-line: jsx-wrap-multiline
            <InputRadioGroup
              radioButtons={[{ value: p.id, headline: "" }]}
              key={p.id}
              onChange={value => {
                if (
                  !this.state.selectedAssignee ||
                  p.id !== this.state.selectedAssignee.id
                ) {
                  this.props.onAssigneeSelection(p);
                }
              }}
              checkedValue={this.state.selectedAssignee instanceof Prebooking && this.state.selectedAssignee.id}
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
  }

  private onSearchChange(query: string | undefined) {
    if (this.props.prebookingIds || (this.state.selectedRoute && this.state.state === "prebookings")) {
      var queriedPrebookings: Prebooking[] = [];
      if (query) {
        var queries = query.split(" ");
        var prebookings = this.state.prebookings;

        queries.forEach(q => {
          queriedPrebookings = prebookings.filter(p =>
            p.driver.company ? p.driver.company.name.toLowerCase().indexOf(q.toLowerCase()) > -1 : false
          );
          queriedPrebookings = queriedPrebookings.concat(prebookings.filter(p => p.driver.formattedName.toLowerCase().indexOf(q.toLowerCase()) > -1));
          queriedPrebookings = queriedPrebookings.concat(prebookings.filter(p => p.driver.id.toString().indexOf(q) > -1));
          queriedPrebookings = queriedPrebookings.concat(prebookings.filter(p => p.driver.phone.number.indexOf(q) > -1));
          queriedPrebookings = queriedPrebookings.concat(prebookings.filter(p => p.forecast.fulfillee.name.toLowerCase().indexOf(q.toLowerCase()) > -1));
        });
        queriedPrebookings = [...new Set(queriedPrebookings)];
      } else {
        queriedPrebookings = this.state.prebookings;
      }

      this.setState({
        search: query,
        queriedPrebookings: queriedPrebookings
      });
    } else if (this.state.selectedRoute) {
      this.setState({
        search: query
      });
      if (this.state.state === "drivers") {
        if (!isNaN(Number(query))) {
          this.fetchDriverById(Number(query));
        } else {
          this.fetchDrivers(this.state.selectedRoute);
        }
      }
    }
  }
}
