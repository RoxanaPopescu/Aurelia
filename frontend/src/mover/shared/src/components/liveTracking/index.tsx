import React from "react";
import { reaction, IReactionDisposer, observable } from "mobx";
import { observer } from "mobx-react";
import { GoogleMap } from "react-google-maps";
import Localization from "shared/src/localization";
import LoadingInline from "shared/src/webKit/loading/inline";
import { RoutesService } from "./services/routesService";
import { Route, RouteStop } from "shared/src/model/logistics/routes/tracking";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { RouteLayer } from "./components/mapLayers/routeLayer/routeLayer";
import { RoutesLayer } from "./components/mapLayers/routesLayer/routesLayer";
import { RoutesPanel } from "./components/panels/routesPanel/routesPanel";
import { RoutePanel } from "./components/panels/routePanel/routePanel";
import { SplitRoutePanel } from "./components/panels/splitRoutePanel/splitRoutePanel";
import "./components/panels/panel.scss";
import "./index.scss";

@observer
export default class LiveTrackingComponent extends React.Component {
  // tslint:disable-next-line: no-any
  public constructor(props: any) {
    super(props);

    document.title = "Live Tracking";

    this.routesService = new RoutesService();
    this.routesService.startPolling();
  }

  private routesService: RoutesService;
  private map: GoogleMap;
  private boundsChanged: boolean | null = false;
  private routesBounds: google.maps.LatLngBounds;
  private reactionDisposers: IReactionDisposer[] = [];

  @observable private routeSubPanel: undefined | "splitRoutePanel";

  @observable private selectedStops: RouteStop[] | undefined;

  private onPopState = (event: PopStateEvent) => {
    if (
      event.state == null ||
      event.state.state == null ||
      this.routesService.routes == null
    ) {
      this.routesService.setSelectedRoute(undefined);
    } else if (event.state.state.routeId) {
      const route = this.routesService.routes.find(
        r => r.id === event.state.state.routeId
      );
      this.routesService.setSelectedRoute(route);
    }
    this.routeSubPanel = undefined;
    // tslint:disable-next-line:semicolon
  };

  public componentDidMount() {
    window.addEventListener("popstate", this.onPopState);

    this.reactionDisposers.push(
      reaction(
        r => this.routesService.selectedRoute,
        route => this.onSelectedRouteChanged(route)
      ),
      reaction(
        r => this.routesService.selectedRouteId,
        routeId => this.onSelectedRouteIdChanged(routeId)
      )
    );

    if (
      history.state != null &&
      history.state.state != null &&
      history.state.state.routeId
    ) {
      this.routesService.selectedRouteId = history.state.state.routeId;
    }
  }

  public componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
    this.reactionDisposers = [];
    window.removeEventListener("popstate", this.onPopState);
    this.routesService.stopPolling();
  }

  public render() {
    if (this.routesService.loading) {
      return (
        <div className="c-liveTracking">
          <LoadingInline/>
        </div>
      );
    } else {
      return (
        <div className="c-liveTracking">
          <div>
            <RoutesPanel
              hidden={this.routesService.selectedRouteId != null}
              routesService={this.routesService}
            />

            {!this.routeSubPanel &&
              this.routesService.selectedRouteId != null && (
                <RoutePanel
                  routesService={this.routesService}
                  onRouteStopSelected={routeStop =>
                    this.onRouteStopSelected(routeStop)
                  }
                  onSplitRouteClick={selectedStops =>
                    this.onSplitRouteClick(selectedStops)
                  }
                />
              )}

            {this.routeSubPanel === "splitRoutePanel" && (
              <SplitRoutePanel
                routesService={this.routesService}
                selectedStops={this.selectedStops!}
                onConfirmSplitClick={() => this.onConfirmSplitClick()}
                onBackClick={() => (this.routeSubPanel = undefined)}
              />
            )}
          </div>

          <div className="c-liveTracking-map">
            <WorldMap
              onMapReady={map => this.onMapReady(map)}
              onBoundsChanged={() => this.onMapBoundsChanged()}
              onZoomChanged={() => this.onMapInteraction()}
              onDragStart={() => this.onMapInteraction()}
              options={{
                scrollwheel: true
              }}
            >
              {this.routesService.selectedRouteId == null && (
                <RoutesLayer routesService={this.routesService} />
              )}

              {this.routesService.selectedRouteId != null && (
                <RouteLayer routesService={this.routesService} />
              )}
            </WorldMap>
          </div>
        </div>
      );
    }
  }

  private onMapReady(map: GoogleMap): void {
    this.map = map;
    this.routesBounds = this.map.getBounds();
    this.tryFitBounds(this.routesService.selectedRoute);
  }

  private onMapInteraction(): void {
    if (this.boundsChanged === false) {
      this.boundsChanged = true;
    }
  }

  private onMapBoundsChanged(): void {
    if (this.routesService.selectedRoute == null) {
      this.routesBounds = this.map.getBounds();
    }
  }

  private onSelectedRouteIdChanged(routeId: string | undefined): void {
    this.boundsChanged = false;
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
    alert(Localization.sharedValue("LiveTracking_RouteSplit_Completed"));
    history.back();
  }
}
