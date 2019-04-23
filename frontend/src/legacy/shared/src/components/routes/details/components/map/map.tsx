import React from "react";
import { GoogleMap } from "react-google-maps";
import { WorldMap } from "shared/src/components/worldMap";
import { RouteDetailsService } from "../../routeDetailsService";
import { RouteLayer } from "./components/mapLayers/routeLayer/routeLayer";
import "./map.scss";

interface Props {
  service: RouteDetailsService;
}

export default class extends React.Component<Props> {
  private map: GoogleMap;
  private boundsChanged: boolean | null = false;

  public render() {
    this.tryFitBounds();

    return (
      <div className="c-routeDetails-map">
        <WorldMap
          onMapReady={map => this.onMapReady(map)}
          onZoomChanged={() => this.onInteraction()}
          onDragStart={() => this.onInteraction()}
          options={{
            scrollwheel: false
          }}
        >
          {this.props.service.routeDetails != null && (
            <RouteLayer routeDetailsService={this.props.service} />
          )}
        </WorldMap>
      </div>
    );
  }

  private onMapReady(map: GoogleMap): void {
    this.map = map;
    this.tryFitBounds();
  }

  private onInteraction(): void {
    if (this.boundsChanged === false) {
      this.boundsChanged = true;
    }
  }

  public tryFitBounds(): void {
    if (this.map != null) {
      const route = this.props.service.routeDetails!;

      const routeBounds = new google.maps.LatLngBounds();

      for (const routeStop of route.stops) {
        routeBounds.extend(routeStop.location.position!.toGoogleLatLng());
      }

      if (route.driverPosition != null) {
        routeBounds.extend(route.driverPosition.toGoogleLatLng());
      }

      // tslint:disable-next-line:no-any
      (this.map.fitBounds as Function)(routeBounds, 50);
    }
  }
}
