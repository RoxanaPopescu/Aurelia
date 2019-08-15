import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import H from "history";
import { TableComponent, Button } from "shared/src/webKit";
import { Driver } from "shared/src/model/logistics/order/driver";
import { PageContentComponent } from "shared/src/components/pageContent";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../shared/src/webKit/button/index";
import { Route } from "shared/src/components/routes/list/models/route";
import { PreBooking } from "../models/preBooking";
import RoutesList from "./components/routesList";
import AsigneeList from "./components/asigneeList";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

interface State {
  origin: "routes" | "pre-bookings";
  ids?: string[];
  routes: Route[];
  preBookings: PreBooking[];
  matches: { route: Route; assignee: Driver | PreBooking }[];
  selectedAssignee?: Driver | PreBooking;
  selectedRoute?: Route;
}

@observer
export default class AssignRoutesComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    document.title = "Assign pre-bookings to routes";

    this.state = {
      origin: this.props.match.params.origin,
      matches: [],
      routes: [],
      preBookings: [],
      ids: this.props.match.params.ids.split(","),
      selectedAssignee: undefined
    };
  }

  componentDidMount() {
    // this.fetchData();
  }

  // private async fetchDrivers(
  //   routes: Route
  // ): Promise<{ drivers: Driver[]; totalCount: number }> {
  //   return await driverDispatchService.fetchDrivers({
  //     date: routes[0].date,
  //     search: this.state.search ? this.state.search : "",
  //     driverIds: []
  //   });
  // }

  // private async assignRoutes(saveAndClose?: boolean) {

  // }

  private getHeaders() {
    return [
      { key: "customer", content: "Customer" },
      { key: "date", content: "Date" },
      { key: "starting-address", content: "Starting address" },
      { key: "end-address", content: "End address" },
      { key: "driver", content: "Driver" },
      { key: "driver-phone", content: "Phone" },
      { key: "vehicle", content: "Vehicle" },
      { key: "stops", content: "Stops" },
      { key: "colli", content: "Colli" },
      { key: "complexity", content: "Complexity" }
    ];
  }

  private getRows() {
    return this.state.matches.map(m => {
      return [
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug,
        m.route.slug
      ];
    });
  }

  render() {
    return (
      <PageContentComponent className="c-assignRoutes">
        <PageHeaderComponent
          path={[
            {
              title: "Disponering",
              href: FulfillerSubPage.path(FulfillerSubPage.DriverDispatch)
            },
            { title: "Assign drivers to routes" }
          ]}
        >
          <div
            onClick={() => {
              this.props.history.goBack();
            }}
            className="c-assignRoutes-closeButton"
          />
        </PageHeaderComponent>
        <div className="c-assignRoutes-topContainer">
          <div className="c-assignRoutes-topLists">
            {this.state.origin === "routes" && (
              <RoutesList
                ids={this.state.ids}
                onRouteSelection={route =>
                  this.setState({ selectedRoute: route })
                }
              />
            )}
            <AsigneeList
              preBookingIds={
                this.state.origin === "pre-bookings"
                  ? this.state.ids
                  : undefined
              }
              selectedRoute={this.state.selectedRoute}
              onAssigneeSelection={assignee =>
                this.setState({ selectedAssignee: assignee })
              }
            />
            {this.state.origin === "pre-bookings" && (
              <RoutesList
                selectedPreBooking={
                  this.state.selectedAssignee instanceof PreBooking
                    ? this.state.selectedAssignee
                    : undefined
                }
                onRouteSelection={route =>
                  this.setState({ selectedRoute: route })
                }
              />
            )}
          </div>
          <div className="c-assignRoutes-topActionContainer">
            <Button
              type={ButtonType.Action}
              size={ButtonSize.Medium}
              disabled={
                this.state.selectedAssignee === undefined ||
                this.state.selectedRoute === undefined
              }
              onClick={() => {
                if (this.state.selectedAssignee && this.state.selectedRoute) {
                  var matches = this.state.matches;
                  matches.push({
                    route: this.state.selectedRoute,
                    assignee: this.state.selectedAssignee
                  });
                  this.setState({
                    matches: matches
                  });
                }
              }}
            >
              Pair
            </Button>
          </div>
        </div>
        <div className="c-assignRoutes-assignedRoutes">
          <TableComponent
            newVersion={true}
            data={{
              headers: this.getHeaders(),
              rows: this.getRows()
            }}
          />
        </div>
        <div className="c-assignRoutes-actionContainer">
          <Button
            type={ButtonType.Action}
            size={ButtonSize.Medium}
            disabled={this.state.matches.length === 0}
            onClick={() => {
              // this.createPreBookings();
            }}
          >
            Assign drivers
          </Button>
        </div>
      </PageContentComponent>
    );
  }
}
