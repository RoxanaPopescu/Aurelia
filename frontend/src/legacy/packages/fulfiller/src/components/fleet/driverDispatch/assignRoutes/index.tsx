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
import { Prebooking } from "../models/prebooking";
import RoutesList from "./components/routesList";
import AsigneeList from "./components/asigneeList";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import Localization from '../../../../../../shared/src/localization/index';
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";
import { driverDispatchService } from '../driverDispatchService';
import Toast from '../../../../../../shared/src/webKit/toast/index';
import { ToastType } from '../../../../../../shared/src/webKit/toast/index';

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

interface State {
  origin: "routes" | "prebookings";
  ids?: string[];
  routes: Route[];
  prebookings: Prebooking[];
  matches: { route: Route; assignee: Driver | Prebooking }[];
  selectedAssignee?: Driver | Prebooking;
  selectedRoute?: Route;
  toasts: JSX.Element[];
}

@observer
export default class AssignRoutesComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Dispatch_AssignRoutes_Title");

    this.state = {
      origin: this.props.match.params.origin,
      matches: [],
      routes: [],
      prebookings: [],
      ids: this.props.match.params.ids.split(","),
      toasts: []
    };
  }

  render() {
    return (
      <PageContentComponent className="c-assignRoutes">
        {this.state.toasts}
        <PageHeaderComponent
          path={[
            {
              title: Localization.operationsValue("RoutePlanning_Title"),
              href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningList)
            },
            {
              title: Localization.operationsValue("Dispatch_Title"),
              href: FulfillerSubPage.path(FulfillerSubPage.DriverDispatch)
            },
            { title: Localization.operationsValue("Dispatch_AssignRoutes_Title") }
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
                onRouteSelection={route => {
                  this.setState({ selectedRoute: route })
                }}
                selectedRoute={this.state.selectedRoute}
                matchedRoutes={this.state.matches.map(m => m.route)}
              />
            )}
            <AsigneeList
              prebookingIds={
                this.state.origin === "prebookings"
                  ? this.state.ids
                  : undefined
              }
              selectedRoute={this.state.selectedRoute}
              selectedAssignee={this.state.selectedAssignee}
              onAssigneeSelection={assignee => {
                this.setState({ selectedAssignee: assignee })
              }}
              matchedAssignees={this.state.matches.map(m => m.assignee)}
            />
            {this.state.origin === "prebookings" && (
              <RoutesList
                selectedPrebooking={
                  this.state.selectedAssignee instanceof Prebooking
                    ? this.state.selectedAssignee
                    : undefined
                }
                selectedRoute={this.state.selectedRoute}
                onRouteSelection={route => {
                  this.setState({ selectedRoute: route })
                }}
                matchedRoutes={this.state.matches.map(m => m.route)}
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
                    matches: matches,
                    selectedAssignee: undefined,
                    selectedRoute: undefined
                  });
                }
              }}
            >
              {Localization.operationsValue("Dispatch_AssignRoutes_Pair")}
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
              this.assignDrivers()
            }}
          >
            {Localization.sharedValue("Approve")}
          </Button>
        </div>
      </PageContentComponent>
    );
  }

  private async assignDrivers() {
    var response = await driverDispatchService.assignDrivers(
      this.state.matches.map(m => {
        var driverId = 0;
        if (m.assignee instanceof Driver) {
          driverId = m.assignee.id;
        } else if (m.assignee instanceof Prebooking) {
          driverId = m.assignee.driver.id;
        }
        return { routeId: m.route.id, driverId: driverId };
      })
    );

    if (response !== undefined) {
      if (response.filter(r => !r.isAssigned).length === 0) {
        driverDispatchService.toast = {
          message: Localization.operationsValue("Dispatch_AssignRoutes_Success")
                    .replace("{number}", response.length.toString()),
          type: "ok"
        }
        this.props.history.goBack();
      } else {
        var toasts: JSX.Element[] = [];

        toasts.push(
          <Toast
            key="successToast"
            type={ToastType.Success}
            remove={() => this.setState({ toasts: this.state.toasts.filter(t => t.key === "successToast") })}
          >
            {Localization.operationsValue("Dispatch_AssignRoutes_Success")
                    .replace("{number}", response.filter(r => r.isAssigned).length.toString())}
          </Toast>
        )

        toasts.push(
          <Toast
            key="alertToast"
            type={ToastType.Alert}
            remove={() => this.setState({ toasts: this.state.toasts.filter(t => t.key === "alertToast") })}
          >
            {Localization.operationsValue("Dispatch_AssignRoutes_Failure")
              .replace("{number}", response.filter(r => !r.isAssigned).length.toString())}
          </Toast>
        )

        this.setState({
          matches: this.state.matches.filter(m => response!.filter(r => r.routeId === m.route.id).length === 0)
        })
      }
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
          <div className="c-assignRoutes-complexityContainer">
            <div className="c-assignRoutes-complexity">{bars}</div>
            {route.complexity.toFixed(2)}
          </div>
          <Button
          size={ButtonSize.Small}
          className="c-assignRoutes-removePairing"
          onClick={() => {
            var matches = this.state.matches;
            this.setState({
              matches: matches.filter(m => m.route.id !== route.id),
              selectedAssignee: undefined,
              selectedRoute: undefined
            })
          }}
          type={ButtonType.Light}
        >
          {Localization.operationsValue("Dispatch_AssignRoutes_RemovePairing")}
        </Button>
      </>
      );
    } else {
      return "--";
    }
  }

  private getHeaders(): { key: string, content: string }[] {
    return [
      { key: "customer", content: Localization.sharedValue("User_Fulfillee") },
      { key: "datetime-interval", content: Localization.operationsValue("Dispatch_StartTimeInterval") },
      { key: "starting-address", content: Localization.operationsValue("Dispatch_StartingAddress") },
      { key: "end-address", content: Localization.operationsValue("Dispatch_EndAddress") },
      { key: "driver", content: Localization.sharedValue("User_Driver") },
      { key: "driver-phone", content: Localization.sharedValue("Phone") },
      { key: "vehicle", content: Localization.sharedValue("Vehicle") },
      { key: "stops", content: Localization.sharedValue("Stops") },
      { key: "complexity", content: Localization.sharedValue("Complexity") }
    ];
  }

  private getRows() {
    return this.state.matches.map(m => {
      return [
        m.route.consignorNames,
        Localization.formatDateTimeRange(
          new DateTimeRange({
             from: m.route.startDateTime,
             to: m.route.endDateTime })),
        m.route.startAddress.primary,
        m.route.endAddress.primary,
        this.assigneeName(m.assignee),
        this.assigneePhone(m.assignee),
        m.route.vehicleType.name,
        m.route.stopCount.toString(),
        this.renderComplexity(m.route)
      ];
    });
  }
}
