import React from "react";
import { observable, action } from "mobx";
import { Marker, Polyline, GoogleMap } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { MoverMarker } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { AutomaticDispatchJob, AutomaticDispatchJobResult, AutomaticDispatchJobStatus, AutomaticDispatchService } from "app/model/automatic-dispatch";
import { Route, RouteBase, RouteStop, RouteStopBase, RouteStopInfo } from "app/model/route";
import { ShipmentStop } from "app/model/shipment";
import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";
import { ApiError } from "shared/infrastructure";

export class RoutePlanningStore {
  private service: AutomaticDispatchService;

  constructor(service: AutomaticDispatchService) {
    this.service = service;
  }

  listMaximumItems = 4;
  listCurrentItems = 0;

  listUnschedulTasksHeight = 56;
  listStopOrderIdsHeight = 56;
  listInfoHeight = 125;
  listItemHeight = 48;
  minuteToPixel = 5;

  @observable
  mapCenter: any; // Specifying type causes a crash: google.maps.LatLng;

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
  job: AutomaticDispatchJob;

  @observable
  plan: AutomaticDispatchJobResult;

  @observable
  focusedRoute?: RouteBase;

  @observable
  focusedStop?: RouteStop;

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
    point: any; // Specifying type causes a crash: google.maps.LatLng;
    mouseOwner?: string;
    infoWindowOffset: number;
  };
  lastBounds?: any; /* Specifying type causes a crash: google.maps.LatLng; */

  @observable
  timeScale = 1;
  @observable
  listHeight = 0;
  listHeightCurrent = 0;
  timeFrame: DateTimeRange = new DateTimeRange({ from: DateTime.local(), to: DateTime.local().plus(Duration.fromObject({hours: 3})) })

  async fetch(id: string) {
    this.loading = true;
    this.initialError = undefined;

    try {
      const job = await this.service.get(id);
      this.job = job;

      if (job.result != null)
      {
        let minimumDate = DateTime.local().plus(Duration.fromObject({ days: 2}));
        let maximumDate = DateTime.local().minus(Duration.fromObject({ days: 2}));

        let index = 0;
        for (const route of job.result.routes) {
          if (route.stops.length == 0)
          {
            continue;
          }

          // Calculate timeframe
          let timeFrame = new DateTimeRange({ from: (route.stops[0] as RouteStopBase).estimates!.timeFrame.from!, to: (route.stops[route.stops.length-1] as RouteStopBase).estimates!.timeFrame.to! }, { setZone: true });

          if (timeFrame.from! < minimumDate)
          {
            minimumDate = timeFrame.from!;
          }

          if (timeFrame.to! > maximumDate)
          {
            maximumDate = timeFrame.to!;
          }

          // Add colors for different routes
          const colors = [
            "#268bbc",
            "#1acce2",
            "#26bcae",
            "#c1e21a",
            "#db9726",
            "#ff5555",
            "#e21aa7",
            "#bd10e0"
          ];

          (route as any).color = colors[index];
          (route as any).number = index + 1;

          if (index == 7) {
            index = 0;
          } else {
            index++;
          }
        }

        this.timeFrame = new DateTimeRange({from: minimumDate, to: maximumDate});

        this.plan = job.result;
        this.minuteToPixel = 6;

        this.listCurrentItems = Math.min(4, this.plan.routes.length);
        this.listHeight =
          this.listCurrentItems * this.listItemHeight + this.listInfoHeight;

        if (this.plan.unscheduledShipments.length > 0) {
          this.listHeight += this.listUnschedulTasksHeight;
        }

        this.listHeightCurrent = this.listHeight;
      }
    } catch (error) {
      if (error instanceof ApiError && error.response?.status === 404) {
        this.initialError = Localization.sharedValue("Error_ResourceNotFound");
      } else {
        this.initialError = Localization.sharedValue("Error_General");
      }

    } finally {
      this.loading = false;
    }
  }

  async updateRoutes(droppedInRoute: Route, stopIndex: number) {
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
  focusRoute(route?: RouteBase, zoom: Boolean = true) {
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
  focusStop(stop: RouteStop | ShipmentStop) {
    if (this.map === undefined) {
      return;
    }

    if (stop instanceof RouteStop) {
      this.focusRoute(stop.route as RouteBase, false);

      let bounds = new google.maps.LatLngBounds();
      bounds.extend(stop.location.position!.toGoogleLatLng());

      if (stop.stopNumber > 1) {
        bounds.extend(
          (stop.route as RouteBase).stops[
            stop.stopNumber - 2
          ].location.position!.toGoogleLatLng()
        );
      }
      if (stop.stopNumber !== (stop.route as RouteBase).stops.length) {
        bounds.extend(
          (stop.route as RouteBase).stops[stop.stopNumber].location.position!.toGoogleLatLng()
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
      this.timeFrame.duration.as("minutes")
    );
  }

  positionInList(stop: RouteStop): number {
    let startInMinutes = this.timeFrame.from!.diff(
      stop.estimates!.timeFrame.from!
    );

    return this.minutesToPixels(startInMinutes.as("minutes"));
  }

  get maximumHeight(): number {
    let height = this.listInfoHeight;
    height += this.plan.routes.length * this.listItemHeight;

    if (this.focusedStop && this.focusedStop.orderIds.length > 0) {
      height += this.listStopOrderIdsHeight;
    } else if (this.plan.unscheduledShipments.length > 0) {
      height += this.listUnschedulTasksHeight;
    }

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

    return height;
  }

  get preferredHeight(): number {
    let minimumHeight = this.listInfoHeight;
    minimumHeight += this.listCurrentItems * this.listItemHeight;

    if (this.focusedStop) {
      minimumHeight += this.listStopOrderIdsHeight;
    } else if (this.plan.unscheduledShipments.length > 0) {
      minimumHeight += this.listUnschedulTasksHeight;
    }

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
      let bounds = new google.maps.LatLngBounds();

      this.focusedRoute.stops.map(stop =>
        bounds.extend(stop.location.position!.toGoogleLatLng())
      );

      this.map.fitBounds(bounds);
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

    for (let shipment of this.plan.unscheduledShipments) {
      bounds.extend(shipment['shipment'].delivery.location.position!.toGoogleLatLng());
    }

    // tslint:disable-next-line:no-any
    let map: any = this.map;
    map.fitBounds(bounds, 5);
  }

  zoomToRoute(route: RouteBase) {
    let bounds = new google.maps.LatLngBounds();

    for (let stop of route.stops) {
      bounds.extend(stop.location.position!.toGoogleLatLng());
    }

    // tslint:disable-next-line:no-any
    let map: any = this.map;
    map.fitBounds(bounds, 50);
  }

  @action
  zoomToCoordinate(coordinate: any /* Specifying type causes a crash: google.maps.LatLng */) {
    this.mapCenter = coordinate;
    this.mapZoom = 15;
  }

  public get createPolylines(): JSX.Element[] {
    let components: JSX.Element[] = [];

    for (let route of this.plan.routes) {
      const positions = route.stops.map(stop =>
        stop.location.position!
      ).map(s => new google.maps.LatLng(s.latitude, s.longitude));

      components.push(
        <Polyline
          key={"polyline_" + route.id}
          path={positions}
          options={{
            geodesic: false,
            strokeColor: (route as any).color,
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

    this.plan.unscheduledShipments.forEach(task => {
      const shipment = task['shipment'];
      const stop = shipment.delivery;

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
                "RoutePlanning_RoutePlan_UnscheduledTaskHover_Title"
              ),
              rows: [
                ...this.getStopRows(shipment.pickup, Localization.sharedValue("Trip_Pickup")),
                ...this.getStopRows(stop, Localization.sharedValue("Trip_Delivery")),
                { headline: Localization.sharedValue("General_Problems"), value: task.reasons.join(", ") }
              ],
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

    let stops: (RouteStop | RouteStopInfo)[] = [];
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
        const positions = route.stops.map(stop =>
          stop.location.position!
        ).map(s => new google.maps.LatLng(s.latitude, s.longitude));

        polylines.push(
          <Polyline
            onClick={() => {
              this.focusRoute(route);
            }}
            key={"polyline_" + route.id}
            path={positions}
            options={{
              strokeColor: (route as any).color,
              geodesic: true,
              strokeWeight: 2,
              strokeOpacity: 0.7
            }}
            onMouseOver={event => {
              this.hoveredItem = {
                title: Localization.operationsValue(
                  "RoutePlanning_RoutePlan_RouteHover_Title"
                ).replace("{number}", (route as any).number),
                rows: this.getRouteRows(route),
                color: (route as any).color,
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
        markers.push(this.stopMarker((stop as RouteStop), index));
      });
    }

    this.markers = markers;
    this.polylines = polylines;
  }

  stopMarker(stop: RouteStop, index: number): JSX.Element {
    let marker: JSX.Element = (
      <MarkerWithLabel
        icon={MoverMarker.markerIconWithLabel((stop.route as any).color)}
        key={stop.id}
        onClick={() => {
          this.hoveredItem = undefined;
          this.focusStop(stop);
        }}
        onMouseOver={() => {
          let title = Localization.operationsValue(
            "RoutePlanning_RoutePlan_StopHover_Title"
          )
            .replace("{routeId}", (stop.route as any).number)
            .replace("{stopNumber}", stop.stopNumber.toString());

          this.hoveredItem = {
            title: title,
            rows: this.getStopRows(stop),
            color: (stop.route as any).color,
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

  markersForRoute(route: RouteBase): JSX.Element[] {
    let markers: JSX.Element[] = [];
    route.stops.forEach((stop, index) => {
      markers.push(this.stopMarker((stop as RouteStop), index));
    });

    return markers;
  }

  polylinesForRoute(route: RouteBase): JSX.Element[] {
    let polylines: JSX.Element[] = [];

    const positions = route.stops.map(stop =>
      stop.location.position!
    ).map(s => new google.maps.LatLng(s.latitude, s.longitude));

    polylines.push(
      <Polyline
        key={"polyline_" + route.id}
        path={positions}
        options={{
          strokeColor: (route as any).color,
          geodesic: true,
          strokeWeight: 3
        }}
      />
    );

    return polylines;
  }

  getStopRows(stop: RouteStop | ShipmentStop, addressName: string | undefined = undefined) {
    let timeframe: string = Localization.formatDateTimeRange(
      stop.arrivalTimeFrame
    );

    let rows = [
      {
        headline: addressName ?? "",
        value: stop.location.address.toString()
      },
      { headline: Localization.sharedValue("TimePeriod"), value: timeframe }
    ];

    if (stop instanceof RouteStop && stop.estimates != null) {
      rows.push({
        headline: Localization.sharedValue("Expected_Arrival"),
        value: Localization.formatTime(stop.estimates.arrivalTime)
      });

      if (stop.estimates.waitingTime != null) {
        rows.push({
          headline: Localization.sharedValue("Expected_TaskTimeStart"),
          value: Localization.formatTime(stop.estimates.arrivalTime.plus(stop.estimates.waitingTime))
        });
      }

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

      if (stop.estimates.distance != null) {
        rows.push({
          headline: Localization.sharedValue("Distance"),
          value: Localization.formatDistance(stop.estimates.distance)
        });
      }
    }

    return rows;
  }

  getRouteRows(route: RouteBase) {
    var drivingTime = 0;
    let taskTime = 0;
    let waitingTime = 0;
    let distance = 0;

    for (const stop of route.stops as RouteStop[]) {
      drivingTime += stop.estimates!.drivingTime?.as("seconds") ?? 0;
      taskTime += stop.estimates!.taskTime?.as("seconds") ?? 0;
      waitingTime += stop.estimates!.waitingTime?.as("seconds") ?? 0;
      distance += stop.estimates!.distance ?? 0;
    }

    return [
      {
        headline: Localization.sharedValue("Expected_DrivingTime"),
        value: Localization.formatDuration(Duration.fromObject({ seconds: drivingTime }))
      },
      {
        headline: Localization.sharedValue("Expected_TaskTime"),
        value: Localization.formatDuration(Duration.fromObject({ seconds: taskTime }))
      },
      {
        headline: Localization.sharedValue("Expected_WaitingTime"),
        value: Localization.formatDuration(Duration.fromObject({ seconds: waitingTime }))
      },
      {
        headline: Localization.sharedValue("Total_Distance"),
        value: Localization.formatDistance(distance)
      }
    ];
  }

  @action
  async approvePlan() {
    this.approving = true;
    this.error = undefined;

    try {
      await this.service.approve(this.job.id);

      this.toastMessage = Localization.operationsValue("RoutePlanning_Approved");
      this.job.status = new AutomaticDispatchJobStatus("succeeded");
    } catch {
      this.error = Localization.sharedValue("Error_General");
    } finally {
      this.approving = false;
    }
  }
}
