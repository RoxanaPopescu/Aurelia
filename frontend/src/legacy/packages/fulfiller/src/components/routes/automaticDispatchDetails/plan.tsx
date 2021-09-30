import React from "react";
import "./styles.scss";
import { Button, ButtonType, MapConstants, ButtonSize } from "shared/src/webKit";
import RouteComponent from "./route";
import RouteInfoComponent from "./route/info";
import { observer } from "mobx-react";
import RouteScaleComponent from "./header/scale";
import { RoutePlanningMap } from "./map";
import Mousetrap from "mousetrap";
import { GoogleMap } from "react-google-maps";
import TimeHeaderComponent from "./header/time";
import MetaHeaderComponent from "./header/meta";
import { RoutePlanningStore } from "./store";
import RoutePlanningTimeDividerComponent from "./route/timeDivider";
import Localization from "../../../../../shared/src/localization/index";
import RoutePlanningUnscheduledStopsComponent from "./unscheduledStops";
import H from "history";
import { Log } from "shared/infrastructure";
import { Profile } from "shared/src/model/profile";
import { RouteBase } from "app/model/route";

interface Props {
  history: H.History;
  store: RoutePlanningStore;
}

@observer
export default class RoutePlanningPlanComponent extends React.Component<Props> {
  trackResize = false;
  trackInitialY?: number;
  map: React.RefObject<GoogleMap>;

  constructor(props: Props) {
    super(props);
    this.map = React.createRef();
  }

  componentWillMount() {
    Mousetrap.bind("z++", () => {
      this.props.store.timeScale += 0.1;
    });

    Mousetrap.bind("z+-", () => {
      this.props.store.timeScale -= 0.1;
    });

    // 1 - 10 routes should link to 1-10 on the keyboard
    for (let i = 1; i < 11; i++) {
      Mousetrap.bind(String(i), () => {
        let index = i - 1;
        if (index < this.props.store.plan.routes.length) {
          this.props.store.focusRoute(this.props.store.plan.routes[index]);
        }
      });
    }

    Mousetrap.bind("esc", () => {
      if (this.props.store.focusedRoute) {
        this.props.store.focusRoute(undefined);
      }
    });

    Mousetrap.bind("right", () => {
      if (this.props.store.focusedRoute) {
        let index: number | undefined;
        for (var i = 0; i < this.props.store.plan.routes.length; i++) {
          let route = this.props.store.plan.routes[i];

          if (route.id === this.props.store.focusedRoute.id) {
            index = i;
          }
        }

        if (index !== undefined) {
          let nextIndex: number;
          if (index === this.props.store.plan.routes.length - 1) {
            nextIndex = 0;
          } else {
            nextIndex = index + 1;
          }

          this.props.store.focusRoute(this.props.store.plan.routes[nextIndex]);
        }
      } else {
        this.props.store.focusRoute(this.props.store.plan.routes[0]);
      }
    });

    Mousetrap.bind("left", () => {
      if (this.props.store.focusedRoute) {
        let index: number | undefined;
        for (var i = 0; i < this.props.store.plan.routes.length; i++) {
          let route = this.props.store.plan.routes[i];

          if (route.id === this.props.store.focusedRoute.id) {
            index = i;
          }
        }

        if (index !== undefined) {
          let nextIndex: number;
          if (index === 0) {
            nextIndex = this.props.store.plan.routes.length - 1;
          } else {
            nextIndex = index - 1;
          }

          this.props.store.focusRoute(this.props.store.plan.routes[nextIndex]);
        }
      } else {
        this.props.store.focusRoute(
          this.props.store.plan.routes[this.props.store.plan.routes.length - 1]
        );
      }
    });
  }

  componentWillUnmount() {
    this.props.store.map = undefined;
    Mousetrap.unbind("z++");
    Mousetrap.unbind("z+-");
    Mousetrap.unbind("left");
    Mousetrap.unbind("right");
    Mousetrap.unbind("esc");

    for (let i = 1; i < 11; i++) {
      Mousetrap.unbind(String(i));
    }
  }

  startDrag() {
    this.trackResize = true;
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));
  }

  stopDrag() {
    if (!this.trackResize) {
      return;
    }

    this.trackResize = false;
    this.trackInitialY = undefined;
    this.props.store.listHeightCurrent = this.props.store.listHeight;
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.removeEventListener("mouseup", this.stopDrag.bind(this));
    this.props.store.zoom();
  }

  // tslint:disable-next-line:no-any
  onMouseMove(e: any) {
    if (this.trackResize === false) {
      return;
    }

    if (this.trackInitialY) {
      let distance = e.y - this.trackInitialY;
      let height = Math.max(
        this.props.store.listHeightCurrent - distance,
        this.props.store.minimumHeight
      );

      height = Math.min(height, this.props.store.maximumHeight);
      this.props.store.listHeight = height;
    } else {
      this.trackInitialY = e.y;
    }
  }

  showMaximumListSize() {
    this.props.store.listHeightCurrent = this.props.store.maximumHeight;
    this.props.store.listHeight = this.props.store.maximumHeight;

    setTimeout(() => this.props.store.zoom(), 200);
  }

  showMinimumListSize() {
    this.props.store.listHeightCurrent = this.props.store.minimumHeight;
    this.props.store.listHeight = this.props.store.minimumHeight;

    setTimeout(() => this.props.store.zoom(), 200);
  }

  render() {
    if (this.props.store.timeFrame.duration.as("days") >= 7) {
      Log.error("Incorrect data of route plan. The duration is over 7 days");
      return <div />;
    }

    return (
      <div className="c-routePlanning-routes">
        <div className="c-routePlanning-routes-mapContainer">
          <RoutePlanningMap
            store={this.props.store}
            googleMapURL={MapConstants.url("3.35")}
            loadingElement={<div style={{ display: "flex", flex: 1 }} />}
            containerElement={<div style={{ display: "flex", flex: 1 }} />}
            mapElement={<div style={{ display: "flex", flex: 1 }} />}
          />
        </div>
        <div
          style={{
            height: this.props.store.listHeight + "px"
          }}
          className="c-routePlanning-routes-list"
        >
          <div className="c-routePlanning-routes-infoBar">
            <div className="c-routePlanning-routes-infoBar-left">
              <MetaHeaderComponent store={this.props.store} />
            </div>
            <div className="c-routePlanning-routes-infoBar-right">
              <div
                onClick={() => this.showMaximumListSize()}
                className="c-routePlanning-routes-infoBar-right-actionButton"
              >
                <img src={require("./assets/expand.svg")} />
                <div className="list1">
                  {Localization.operationsValue(
                    "RoutePlanning_RoutePlan_List_ShowMore"
                  )}
                </div>
              </div>
              <div
                onClick={() => this.showMinimumListSize()}
                className="c-routePlanning-routes-infoBar-right-actionButton"
              >
                <img src={require("./assets/collapse.svg")} />
                <div className="list1">
                  {Localization.operationsValue(
                    "RoutePlanning_RoutePlan_List_ShowLess"
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.props.store.plan.unscheduledShipments.length > 0 && !(this.props.store.focusedStop && this.props.store.focusedStop.orderIds.length > 0) && (
            <RoutePlanningUnscheduledStopsComponent store={this.props.store} />
          )}
          <div className="c-routePlanning-routes-list-main">
            <RouteScaleComponent store={this.props.store} />
            <div className="c-routePlanning-routes-list-mainContainer">
              <div className="c-routePlanning-routes-list-mainLeft">
                <div className="c-routePlanning-routes-routeInfoContainer">
                  <div className="c-routePlanning-routes-list-headerInfo">
                    <div className="c-routePlanning-routes-routeIdRow">
                      {Localization.operationsValue(
                        "RoutePlanning_RoutePlan_List_RuteID"
                      )}
                    </div>
                    <div className="c-routePlanning-routes-list-headerInfo-fade" />
                  </div>
                  {this.props.store.plan.routes.map((route, index) => (
                    <RouteInfoComponent
                      store={this.props.store}
                      key={route.id}
                      route={route}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div className="c-routePlanning-routes-list-mainRight">
                <TimeHeaderComponent store={this.props.store} />
                <RoutePlanningTimeDividerComponent store={this.props.store} />
                {this.props.store.plan.routes.map(route => (
                  <RouteComponent
                    store={this.props.store}
                    key={route.id}
                    route={route}
                  />
                ))}
              </div>
            </div>
          </div>
          {Profile.claims.has("create-routeplan-simulation") &&
          <div className="c-routePlanning-routes-list-bottomBar">
            {this.props.store.job.status.slug == "waiting-for-approval" &&
              <Button
                loading={this.props.store.approving}
                type={ButtonType.Action}
                onClick={() => {
                  if (confirm(Localization.operationsValue("RoutePlanning_ApprovalValidation"))) {
                    this.props.store.approvePlan();
                  }
                }}
            >
              {this.props.store.approving ? Localization.operationsValue("RoutePlanning_Approving") : Localization.operationsValue("RoutePlanning_ApproveButton")}
            </Button>
          }
          </div>}
          <div
            className="c-routePlanning-routes-list-resize"
            onMouseDown={() => this.startDrag()}
          />
          {this.props.store.updatingRoute && (
            <div className="c-routePlanning-routes-list-loading">
              <div className="font-larger">
                {Localization.sharedValue("Route_Updating")}
              </div>
            </div>
          )}
        </div>
        {this.props.store.focusedRoute &&
          this.renderTopInfoView(this.props.store.focusedRoute)}
      </div>
    );
  }

  renderTopInfoView(route: RouteBase) {
    return (
      <div className="c-routePlanning-mapInfoTop">
        <Button
          onClick={() => {
            this.props.store.focusRoute(undefined);
          }}
          type={ButtonType.Action}
          size={ButtonSize.Medium}
        >
          {Localization.operationsValue(
            "RoutePlanning_RoutePlan_Route_ExitSingle"
          ).replace("{route_id}", (route as any).number)}
        </Button>
      </div>
    );
  }
}
