import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { TableComponent, Input, InputRadioGroup } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { Route } from "shared/src/components/routes/list/models/route";
import InfoBox from "../../../components/infoBox";
import { PreBooking } from "../../../models/preBooking";
import { driverDispatchService } from "../../../driverDispatchService";

interface Props {
  selectedPreBooking?: PreBooking;
  ids?: string[];
  onRouteSelection(route: Route);
  matchedRoutes: Route[];
}

interface State {
  selectedRoute?: Route;
  search?: string;
  routes: Route[];
  queriedRoutes: Route[];
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedRoute: undefined,
      routes: [],
      queriedRoutes: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (this.props.ids) {
      try {
        var routes = await driverDispatchService.fetchUnassignedRoutesByIds(
          this.props.ids
        );
        this.setState({ routes: routes });
      } catch {
        // Hej
      }
    }

    if (this.props.selectedPreBooking) {
      // const response = await fetch(
      //   BaseService.url("routes/details", { routeSlug: "R7909833124" }),
      //   BaseService.defaultConfig()
      // );
      // if (response.status === 404) {
      //   const error = new Error(
      //     Localization.sharedValue("Error_RouteNotFound")
      //   );
      //   error.name = "not-found-error";
      //   throw error;
      // }
      // if (!response.ok) {
      //   throw new Error(Localization.sharedValue("Error_General"));
      // }
      // const data = await response.json();
      // this.setState({ routes: [new Route(data)] });
    }
  }

  private getHeaders() {
    return [
      {
        key: "select",
        content: ""
      },
      { key: "customer", content: "Customer" },
      { key: "start-time", content: "Start time" },
      { key: "start-address", content: "Start address" },
      { key: "colli", content: "Colli" },
      { key: "complexity", content: "Complexity" }
    ];
  }

  private renderComplexity(route: Route) {
    var bars: JSX.Element[] = [];

    for (var i = 1; i <= 4; i++) {
      var width = 100;
      if (i * 25 > route.complexity) {
        if (i * 25 - route.complexity > 25) {
          width = 0;
        } else {
          width = route.complexity % (i * 25);
        }
      }

      bars.push(
        <div
          key={`route-${route.id}-bar-${i}`}
          className="c-assignRoutes-complexity-bar"
        >
          <div
            style={{ width: `${width}%` }}
            className="c-assignRoutes-complexity-filler"
          />
        </div>
      );
    }

    if (route.complexity !== undefined) {
      return (
        <>
          <div className="c-assignRoutes-complexity">{bars}</div>
          {route.complexity.toFixed(2)}
        </>
      );
    } else {
      return "--";
    }
  }

  private getRows() {
    var routes = [...new Set(this.state.routes.concat(this.props.matchedRoutes))];
    return routes.map((r, i) => {
      return [
        // tslint:disable-next-line: jsx-wrap-multiline
        <InputRadioGroup
          radioButtons={[{ value: r.id, headline: "" }]}
          key={`${r.id}-radio`}
          onChange={value => {
            console.log(this.state.selectedRoute, r, value)
            if (
              this.state.selectedRoute === undefined ||
              r.id !== this.state.selectedRoute.id
            ) {
              this.setState({
                selectedRoute: r
              });
              this.props.onRouteSelection(r);
            }
          }}
        />,
        // tslint:disable-next-line: jsx-wrap-multiline
        <div
          key={`${r.fulfiller ? r.fulfiller.companyName : ""}-fulfiller`}
          className="c-assignRoutes-ellipsis"
        >
          {r.consignorNames}
        </div>,
        Localization.formatDateTime(r.startDateTime),
        // tslint:disable-next-line: jsx-wrap-multiline
        <div key={`${r.id}-address`} className="c-assignRoutes-ellipsis">
          {r.startAddress.primary}
        </div>,
        "--",
        this.renderComplexity(r)
      ];
    });
  }

  private onSearchChange(query: string | undefined) {
    var queriedRoutes: Route[] = [];
    if (query) {
      var queries = query.split(" ");
      var routes = this.state.routes;

      queries.forEach(q => {
        queriedRoutes = routes.filter(r =>
          r.fulfiller ? r.fulfiller.companyName!.indexOf(q) > 0 : false
        );
        queriedRoutes.concat(routes.filter(r => r.id.indexOf(q) > 0));
      });
      queriedRoutes = [...new Set(queriedRoutes)];
    } else {
      queriedRoutes = this.state.routes;
    }
    this.setState({
      search: query,
      queriedRoutes: queriedRoutes
    });
  }

  private renderAccordionContent(route: Route) {
    return (
      <div className="c-assignRoutes-accordion">
        <div className="c-assignRoutes-accordionInfo">
          <div className="font-heading">End address</div>
          <div>{route.endAddress.primary}</div>
        </div>
        <div className="c-assignRoutes-accordionInfo">
          <div className="font-heading">End time</div>
          <div>{Localization.formatDateTime(route.endDateTime)}</div>
        </div>
        <div className="c-assignRoutes-accordionInfo">
          <div className="font-heading">Vehicle</div>
          <div>{route.vehicleType.name}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="c-assignRoutes-routes">
          <InfoBox
            data={[
              { name: "Unassigned routes", value: this.state.routes.length }
            ]}
          />
          <Input
            className="c-createPreBooking-search"
            headline="Search for specific routes"
            placeholder={Localization.sharedValue("Search_TypeToSearch")}
            onChange={(value, event) => {
              if (event) {
                event.persist();
              }

              this.onSearchChange(value);
            }}
            value={this.state.search}
          />
          <TableComponent
            newVersion={true}
            data={{
              headers: this.getHeaders(),
              rows: this.getRows()
            }}
            accordionRows={rowIndex => {
              if (rowIndex !== undefined) {
                return this.renderAccordionContent(this.state.routes[rowIndex]);
              }
              return <></>;
            }}
            gridTemplateColumns="min-content auto auto 60rem auto auto"
          />
        </div>
      </>
    );
  }
}
