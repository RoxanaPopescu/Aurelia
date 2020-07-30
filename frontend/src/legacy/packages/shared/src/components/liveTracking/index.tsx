import React from "react";
import { reaction, IReactionDisposer, observable } from "mobx";
import { observer } from "mobx-react";
import { GoogleMap } from "react-google-maps";
import Localization from "shared/src/localization";
import LoadingInline from "shared/src/webKit/loading/inline";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { RouteLayer } from "./components/mapLayers/routeLayer/routeLayer";
import { RoutesLayer } from "./components/mapLayers/routesLayer/routesLayer";
import { RoutesPanel } from "./components/panels/routesPanel/routesPanel";
import { RoutePanel } from "./components/panels/routePanel/routePanel";
import { SplitRoutePanel } from "./components/panels/splitRoutePanel/splitRoutePanel";
import "./components/panels/panel.scss";
import "./index.scss";
import { Log } from "shared/infrastructure";
import { DriversPanel } from "./components/panels/driversPanel/driversPanel";
import { LiveTrackingService } from "./services/liveTrackingService";
import { RouteService, RouteStop, Route } from "app/model/route";
import { Button, ButtonType } from "shared/src/webKit";

export interface ILiveTrackingProps
{
    routeService: RouteService
}

@observer
export default class LiveTrackingComponent extends React.Component<ILiveTrackingProps> {
  // tslint:disable-next-line: no-any
  public constructor(props: LiveTrackingService) {
    super(props);
    this.service = new LiveTrackingService(this.props.routeService);
  }

  private service: LiveTrackingService;
  private map: GoogleMap;
  private boundsChanged: boolean | null = false;
  private routesBounds: google.maps.LatLngBounds;
  private reactionDisposers: IReactionDisposer[] = [];

  @observable private routeSubPanel: undefined | "splitRoutePanel" | "driversPanel";
  @observable private selectedStops: RouteStop[] | undefined;

  private onPopState = (event: PopStateEvent) => {
    if (
      event.state == null ||
      event.state.state == null ||
      this.service.filteredRoutes == null
    ) {
      this.service.setSelectedRouteSlug(undefined);
    } else if (event.state.state.routeSlug) {
      this.service.setSelectedRouteSlug(event.state.state.routeSlug);
    }
    this.routeSubPanel = undefined;
    // tslint:disable-next-line:semicolon
  };

  public componentDidMount() {
    window.addEventListener("popstate", this.onPopState);

    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onBlur);

    this.reactionDisposers.push(
      reaction(
        r => this.service.selectedRoute,
        route => {
          this.onSelectedRouteChanged(route)
        }
      )
    );

    if (
      history.state != null &&
      history.state.state != null &&
      history.state.state.routeSlug
    ) {
      this.service.selectedRouteSlug = history.state.state.routeSlug;
    }
  }

  public componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
    this.reactionDisposers = [];
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);

    this.service.stopPolling();
  }

  onBlur = () => {
    this.service.setNotInFocus();
  }

  onFocus = () => {
    this.service.setInFocus();
  }

  public render() {
    if (!this.service.loadedResults) {
      return (
        <div className="c-liveTracking">
          <LoadingInline/>
        </div>
      );
    } else {
      let driversOnlineTitle = Localization.sharedValue("Map_DriversInArea");
      if (this.service.loadingDriversInArea) {
        driversOnlineTitle = Localization.sharedValue("General_Loading");
      } else if (this.service.onlineDrivers) {
        driversOnlineTitle = Localization.sharedValue("Map_DriversInArea_Remove")
          .replace("{count}", this.service.onlineDrivers.length.toString());
      }

      return (
        <div className="c-liveTracking">
          <div>
            <RoutesPanel
              hidden={this.service.selectedRouteSlug != null}
              service={this.service}
            />

            {!this.routeSubPanel &&
              this.service.selectedRouteSlug != null && (
                <RoutePanel
                  service={this.service}
                  onRouteStopSelected={routeStop =>
                    this.onRouteStopSelected(routeStop)
                  }
                  onSplitRouteClick={selectedStops =>
                    this.onSplitRouteClick(selectedStops)
                  }
                  onDriversClick={() =>
                    this.onDriversClick()
                  }
                />
              )}

            {this.routeSubPanel === "splitRoutePanel" && (
              <SplitRoutePanel
                service={this.service}
                selectedStops={this.selectedStops!}
                onConfirmSplitClick={() => this.onConfirmSplitClick()}
                onBackClick={() => (this.routeSubPanel = undefined)}
              />
            )}

            {this.routeSubPanel === "driversPanel" && (
              <DriversPanel
                service={this.service}
                onConfirmClick={() => this.onConfirmPushDriversClick()}
                onBackClick={() => (this.routeSubPanel = undefined)}
              />
            )}
          </div>

          <div className="c-liveTracking-map">
            <div className="c-liveTracking-map-buttons">
                  <Button
                      className="routeDetails-map-fit-button"
                      type={ButtonType.Light}
                      disabled={this.service.loadingDriversInArea}
                      onClick={() => {
                        if (this.service.onlineDrivers) {
                          this.service.onlineDrivers = undefined;
                          return;
                        }

                        this.service.fetchOnlineDrivers(
                          this.map.getBounds().getNorthEast(),
                          this.map.getBounds().getSouthWest()
                        );
                      }}>
                      {driversOnlineTitle}
                  </Button>
              </div>

            <WorldMap
              onMapReady={map => this.onMapReady(map)}
              onBoundsChanged={() => this.onMapBoundsChanged()}
              onZoomChanged={() => this.onMapInteraction()}
              onDragStart={() => this.onMapInteraction()}
              options={{
                scrollwheel: true
              }}
            >
              {this.service.selectedRouteSlug ?
                <RouteLayer service={this.service} /> :
                <RoutesLayer service={this.service} />
              }

            </WorldMap>
          </div>
        </div>
      );
    }
  }

  private onMapReady(map: GoogleMap): void {
    this.map = map;
    this.routesBounds = this.map.getBounds();

    if (this.service.selectedRoute != null) {
      this.tryFitBounds(this.service.selectedRoute);
    }
  }

  private onMapInteraction(): void {
    if (this.boundsChanged === false) {
      this.boundsChanged = true;
    }
  }

  private onMapBoundsChanged(): void {
    if (this.service.selectedRoute == null) {
      this.routesBounds = this.map.getBounds();
    }
  }

  // Note that this is called after every poll request.
  private onSelectedRouteChanged(route: Route | undefined): void {
    if (route != null) {
      if (this.boundsChanged === true) {
        return;
      }
      this.boundsChanged = null;
    } else {
      this.boundsChanged = false;
    }

    this.tryFitBounds(route);
    this.boundsChanged = false;
  }


  private tryFitBounds(route?: Route): void {
    if (this.map == null) {
      return;
    }

    if (route != null) {
      const routeBounds = new google.maps.LatLngBounds();

      for (const routeStop of route.stops) {
        routeBounds.extend(routeStop.location.position!.toGoogleLatLng());
      }

      if (route.driverPosition != null) {
        routeBounds.extend(route.driverPosition.toGoogleLatLng());
      }

      (this.map.fitBounds as Function)(routeBounds, 50);
    } else if (this.routesBounds != null) {
      (this.map.fitBounds as Function)(this.routesBounds, 0);
    }
  }

  private onRouteStopSelected(routeStop: RouteStop): void {
    this.boundsChanged = true;
    if (this.map != null) {
      this.map.panTo(routeStop.location.position!.toGoogleLatLng());
    }
  }

  private onSplitRouteClick(selectedStops: RouteStop[]): void {
    this.selectedStops = selectedStops;
    this.routeSubPanel = "splitRoutePanel";
    history.pushState(history.state, "", window.location.href);
  }

  private onConfirmSplitClick(): void {
    this.selectedStops = undefined;
    Log.info(Localization.sharedValue("LiveTracking_RouteSplit_Completed"));
    history.back();
  }

  private onDriversClick(): void {
    this.routeSubPanel = "driversPanel";
    // history.pushState(history.state, "", window.location.href);
  }

  private onConfirmPushDriversClick(): void {
    Log.info(Localization.sharedValue("LiveTracking_PushedToDrivers_Completed"));
    history.back();
  }
}
