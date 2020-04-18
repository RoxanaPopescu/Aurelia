import React from "react";
import { observable, action } from "mobx";
import {
  RoutePlan,
  RoutePlanRoute,
  RoutePlanStopBase,
  RoutePlanRouteStop
} from "shared/src/model/logistics/routePlanning";
import { Marker, Polyline, GoogleMap } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { MoverMarker } from "shared/src/webKit";
import Base from "shared/src/services/base";
import Localization from "shared/src/localization";

export type DragType = "Stop" | "UnscheduledTask";

export class RoutePlanningStore {
  listMaximumItems = 4;
  listCurrentItems = 0;

  listUnschedulTasksHeight = 56;
  listInfoHeight = 140;
  listItemHeight = 48;
  minuteToPixel = 5;

  @observable
  mapCenter: google.maps.LatLng;

  @observable
  mapZoom = 7;

  @observable
  updatingRoute = false;
  @observable
  loading = true;
  @observable
  approving = false;
  @observable
  initialError?: string;
  @observable
  error?: string;
  @observable
  toastMessage?: string;

  @observable
  plan: RoutePlan;

  @observable
  focusedRoute?: RoutePlanRoute;

  @observable
  focusedStop?: RoutePlanRouteStop;

  @observable
  markers: JSX.Element[] = [];
  @observable
  polylines: JSX.Element[] = [];

  @observable
  map?: GoogleMap;
  @observable
  hoveredItem?: {
    title: string;
    subTitle?: string;
    rows: { headline: string; value: string }[];
    color: string;
    point: google.maps.LatLng;
    mouseOwner?: string;
    infoWindowOffset: number;
  };
  lastBounds?: google.maps.LatLngBounds;

  @observable
  timeScale = 1;
  @observable
  listHeight = 0;
  listHeightCurrent = 0;

  async fetch(id: string) {
    this.loading = true;
    this.initialError = undefined;

    let items: { [Key: string]: string } = {
      id: id
    };

    let response = await fetch(
      Base.url("RoutePlanning/plans/Details"),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      let responseJson = await response.json();

      var plan = new RoutePlan(responseJson, id);
      this.minuteToPixel = 6;
      this.plan = plan;

      this.listCurrentItems = Math.min(4, this.plan.routes.length);
      this.listHeight =
        this.listCurrentItems * this.listItemHeight + this.listInfoHeight;

      if (this.plan.unscheduledTasks.length > 0) {
        this.listHeight += this.listUnschedulTasksHeight;
      }

      this.listHeightCurrent = this.listHeight;
    } else {
      this.initialError = Localization.sharedValue("Error_General");
    }

    this.loading = false;
  }

  // FIXME: should take from & to
  async updateRoutes(droppedInRoute: RoutePlanRoute, stopIndex: number) {
    this.updatingRoute = true;

    setTimeout(() => {
      this.updatingRoute = false;
      this.focusRoute(droppedInRoute);
    }, 2000);
  }

  mapLoaded(ref: GoogleMap) {
    if (!ref || this.map) {
      return;
    }

    this.map = ref;
    if (this.lastBounds) {
      this.map.fitBounds(this.lastBounds);
    } else {
      this.zoom();
    }
  }

  @action
  focusRoute(route?: RoutePlanRoute, zoom: Boolean = true) {
    this.focusedRoute = route;
    this.checkBounds();

    if (zoom) {
      if (route) {
        this.zoomToRoute(route);
      } else {
        this.zoom();
      }
    }

    this.focusedStop = undefined;
  }

  @action
  focusStop(stop: RoutePlanStopBase) {
    if (this.map === undefined) {
      return;
    }

    if (stop instanceof RoutePlanRouteStop) {
      this.focusRoute(stop.route, false);

      let bounds = new google.maps.LatLngBounds();
      bounds.extend(stop.location.position!.toGoogleLatLng());
      if (stop.stopNumber > 1) {
        bounds.extend(
          stop.route.stops[
            stop.stopNumber - 2
          ].location.position!.toGoogleLatLng()
        );
      }
      if (stop.stopNumber !== stop.route.stops.length) {
        bounds.extend(
          stop.route.stops[stop.stopNumber].location.position!.toGoogleLatLng()
        );
      }
      // tslint:disable-next-line:no-any
      let map: any = this.map;
      map.fitBounds(bounds, 50);

      this.focusedStop = stop;
    } else {
      this.focusRoute(undefined);
      this.map.panTo(stop.location.position!.toGoogleLatLng());

      this.focusedStop = undefined;
    }
  }

  minutesToPixels(minutes: number): number {
    return this.minuteToPixel * minutes * this.timeScale;
  }

  @action
  checkBounds() {
    if (this.map === undefined) {
      return;
    }

    let bounds = this.map.getBounds();
    this.update(bounds);
    this.lastBounds = bounds;
  }

  get listWidth(): number {
    return this.minutesToPixels(
      this.plan.meta.timeFrame.duration.as("minutes")
    );
  }

  positionInList(stop: RoutePlanRouteStop): number {
    let startInMinutes = this.plan.meta.timeFrame.from!.diff(
      stop.estimates.timeFrame.from!
    );

    return this.minutesToPixels(startInMinutes.as("minutes"));
  }

  get maximumHeight(): number {
    let height = this.listInfoHeight;
    height += this.plan.routes.length * this.listItemHeight;

    const maximumProcentOfScreen = 0.75;
    const maximumHeight = window.innerHeight * maximumProcentOfScreen;
    if (height > maximumHeight) {
      let difference = height - maximumHeight;
      let tooManyItems =
        (difference - (difference % this.listItemHeight)) /
          this.listItemHeight +
        1;
      height -= tooManyItems * this.listItemHeight;
    }

    if (this.plan.unscheduledTasks.length > 0) {
      height += this.listUnschedulTasksHeight;
    }

    return height;
  }

  get preferredHeight(): number {
    let minimumHeight = this.listInfoHeight;
    minimumHeight += this.listCurrentItems * this.listItemHeight;
    return minimumHeight;
  }

  get minimumHeight(): number {
    return 85;
  }

  setMapViewport() {
    if (!this.map) {
      return;
    }

    if (this.focusedRoute) {
      this.map.fitBounds(this.focusedRoute.mapBounds);
    } else {
      this.zoom();
    }
  }

  zoom() {
    if (!this.map) {
      return;
    }

    let bounds = new google.maps.LatLngBounds();

    for (let route of this.plan.routes) {
      for (let stop of route.stops) {
        bounds.extend(stop.location.position!.toGoogleLatLng());
      }
    }

    for (let task of this.plan.unscheduledTasks) {
      bounds.extend(task.delivery.location.position!.toGoogleLatLng());
    }

    // tslint:disable-next-line:no-any
    let map: any = this.map;
    map.fitBounds(bounds, 5);
  }

  zoomToRoute(route: RoutePlanRoute) {
    let bounds = new google.maps.LatLngBounds();

    for (let stop of route.stops) {
      bounds.extend(stop.location.position!.toGoogleLatLng());
    }

    // tslint:disable-next-line:no-any
    let map: any = this.map;
    map.fitBounds(bounds, 50);
  }

  @action
  zoomToCoordinate(coordinate: google.maps.LatLng) {
    this.mapCenter = coordinate;
    this.mapZoom = 15;
  }

  public get createPolylines(): JSX.Element[] {
    let components: JSX.Element[] = [];

    for (let route of this.plan.routes) {
      components.push(
        <Polyline
          key={"polyline_" + route.id}
          path={route.directions.pathToGoogleLatLng()}
          options={{
            geodesic: false,
            strokeColor: route.color,
            strokeOpacity: 0.0,
            strokeWeight: 1,
            icons: [
              {
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 0.4,
                  scale: 2
                },
                offset: "0",
                repeat: "8px"
              }
            ]
          }}
        />
      );
    }

    return components;
  }

  update(bounds: google.maps.LatLngBounds) {
    let markers: JSX.Element[] = [];
    let polylines: JSX.Element[] = [];

    if (this.focusedRoute) {
      this.markers = this.markersForRoute(this.focusedRoute);
      this.polylines = this.polylinesForRoute(this.focusedRoute);
      return;
    }

    this.plan.unscheduledTasks.forEach(task => {
      const stop = task.delivery;

      markers.push(
        <Marker
          icon={{
            url: require("./assets/requestBeAware.png"),
            size: new google.maps.Size(31, 36),
            anchor: new google.maps.Point(15.5, 36)
          }}
          position={stop.location.position!.toGoogleLatLng()}
          key={"marker_" + stop.id}
          onMouseOver={() => {
            this.hoveredItem = {
              title: Localization.operationsValue(
                "RoutePlanning_RoutePlan_UnscheduledStopHover_Title"
              ),
              rows: this.getStopRows(stop),
              color: "black",
              point: stop.location.position!.toGoogleLatLng(),
              infoWindowOffset: -35
            };
          }}
          zIndex={9999}
          onMouseOut={() => {
            this.hoveredItem = undefined;
          }}
        />
      );
    });

    let stops: RoutePlanRouteStop[] = [];
    this.plan.routes.map(route => {
      // Check if any stops are within
      let polyWithinBounds = false;
      route.stops.forEach((stop, index) => {
        if (
          index !== 0 &&
          bounds.contains(stop.location.position!.toGoogleLatLng())
        ) {
          polyWithinBounds = true;
          stops.push(stop);
        }
      });

      if (polyWithinBounds) {
        polylines.push(
          <Polyline
            onClick={() => {
              this.focusRoute(route);
            }}
            key={"polyline_" + route.id}
            path={route.directions.pathToGoogleLatLng()}
            options={{
              strokeColor: route.color,
              geodesic: true,
              strokeWeight: 2,
              strokeOpacity: 0.7
            }}
            onMouseOver={event => {
              this.hoveredItem = {
                title: Localization.operationsValue(
                  "RoutePlanning_RoutePlan_RouteHover_Title"
                ).replace("{number}", route.slug),
                rows: this.getRouteRows(route),
                color: route.color,
                point: event.latLng,
                infoWindowOffset: 0
              };
            }}
            onMouseOut={() => {
              this.hoveredItem = undefined;
            }}
          />
        );
      }
    });

    // Limit amount of stop markers - too many will overload the Client's computer
    if (stops.length <= 200) {
      stops.forEach((stop, index) => {
        markers.push(this.stopMarker(stop, index));
      });
    }

    this.markers = markers;
    this.polylines = polylines;
  }

  stopMarker(stop: RoutePlanRouteStop, index: number): JSX.Element {
    let marker: JSX.Element = (
      <MarkerWithLabel
        icon={MoverMarker.markerIconWithLabel(stop.route.color)}
        key={stop.id}
        onClick={() => {
          this.hoveredItem = undefined;
          this.focusStop(stop);
        }}
        onMouseOver={() => {
          let title = Localization.operationsValue(
            "RoutePlanning_RoutePlan_StopHover_Title"
          )
            .replace("{routeId}", stop.route.slug)
            .replace("{stopNumber}", stop.stopNumber.toString());

          this.hoveredItem = {
            title: title,
            rows: this.getStopRows(stop),
            color: stop.route.color,
            point: stop.location.position!.toGoogleLatLng(),
            infoWindowOffset: -20
          };
        }}
        onMouseOut={() => {
          this.hoveredItem = undefined;
        }}
        position={stop.location.position!.toGoogleLatLng()}
        labelAnchor={new google.maps.Point(7, 20)}
        labelClass="c-routePlanning-mapPin"
      >
        <div key="label">{stop.stopNumber}</div>
      </MarkerWithLabel>
    );

    return marker;
  }

  markersForRoute(route: RoutePlanRoute): JSX.Element[] {
    let markers: JSX.Element[] = [];
    route.stops.forEach((stop, index) => {
      markers.push(this.stopMarker(stop, index));
    });

    return markers;
  }

  polylinesForRoute(route: RoutePlanRoute): JSX.Element[] {
    let polylines: JSX.Element[] = [];

    polylines.push(
      <Polyline
        key={"polyline_" + route.id}
        path={route.directions.pathToGoogleLatLng()}
        options={{
          strokeColor: route.color,
          geodesic: true,
          strokeWeight: 3
        }}
      />
    );

    return polylines;
  }

  getStopRows(stop: RoutePlanStopBase) {
    let timeframe: string = Localization.formatDateTimeRange(
      stop.arrivalTimeFrame
    );

    let rows = [
      {
        headline: Localization.sharedValue("Address"),
        value: stop.location.address.formattedString()
      },
      { headline: Localization.sharedValue("TimePeriod"), value: timeframe }
    ];

    if (stop instanceof RoutePlanRouteStop && stop.route) {
      rows.push({
        headline: Localization.sharedValue("Expected_Arrival"),
        value: Localization.formatTime(stop.estimates.arrival)
      });
      rows.push({
        headline: Localization.sharedValue("Expected_DrivingTime"),
        value: Localization.formatDuration(stop.estimates.drivingTime)
      });
      rows.push({
        headline: Localization.sharedValue("Expected_TaskTime"),
        value: Localization.formatDuration(stop.estimates.taskTime)
      });
      rows.push({
        headline: Localization.sharedValue("Expected_WaitingTime"),
        value: Localization.formatDuration(stop.estimates.waitingTime)
      });

      rows.push({
        headline: Localization.sharedValue("Colli_Count"),
        value: stop.colliCount.toString()
      });
      rows.push({
        headline: Localization.sharedValue("Order_Count"),
        value: stop.orderIds.length.toString()
      });
    }

    return rows;
  }

  getRouteRows(route: RoutePlanRoute) {
    return [
      {
        headline: Localization.sharedValue("Expected_TimePeriod"),
        value: Localization.formatTimeRange(route.meta.timeFrame)
      },
      {
        headline: Localization.sharedValue("Expected_DrivingTime"),
        value: Localization.formatDuration(route.meta.drivingTime)
      },
      {
        headline: Localization.sharedValue("Expected_TaskTime"),
        value: Localization.formatDuration(route.meta.taskTime)
      },
      {
        headline: Localization.sharedValue("Expected_WaitingTime"),
        value: Localization.formatDuration(route.meta.waitingTime)
      },
      {
        headline: Localization.sharedValue("Colli_Count"),
        value: route.meta.colliCount.toString()
      },
      {
        headline: Localization.sharedValue("Order_Count"),
        value: route.meta.orderCount.toString()
      }
    ];
  }

  @action
  async approvePlan() {
    this.approving = true;
    this.error = undefined;

    let items: { [Key: string]: string } = {
      id: this.plan.id
    };

    let response = await fetch(
      Base.url("RoutePlanning/plans/approve"),
      Base.defaultConfig(items)
    );

    if (!response.ok) {
      this.error = Localization.sharedValue("Error_General");
    } else {
      this.toastMessage = "Ruteplanen er godkendt";
      this.plan.status = "succeeded";
    }

    this.approving = false;
  }
}
