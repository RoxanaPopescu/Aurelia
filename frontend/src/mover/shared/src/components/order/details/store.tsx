import { observable, reaction } from "mobx";
import { Order, Collo, Journey } from "shared/src/model/logistics/order";
import { GoogleMap } from "react-google-maps";
import React from "react";
import { JourneyStopMarker } from "./components/mapComponents/marker";
import { PassageLine } from "./components/mapComponents/line";
import { RouteDetailsService } from "../../routes/details/routeDetailsService";

export class OrderDetailsStore {
  orderId: string;
  @observable order?: Order;
  @observable journey?: Journey;
  @observable selectedCollo?: Collo;
  @observable map?: GoogleMap;
  @observable
  routeDetailsService: RouteDetailsService = new RouteDetailsService();

  @observable success?: string;
  @observable error?: string;
  @observable loading: boolean = true;

  constructor() {
    reaction(() => this.map, () => this.setBounds());
  }

  setBounds() {
    if (this.order && this.map) {
      let bounds = new google.maps.LatLngBounds();

      if (this.order.consignor.location.position) {
        bounds.extend(this.order.consignor.location.position.toGoogleLatLng());
      }
      if (this.order.consignee.location.position) {
        bounds.extend(this.order.consignee.location.position.toGoogleLatLng());
      }

      this.map.fitBounds(bounds);
    }
  }

  get markers(): JSX.Element[] {
    var markers: JSX.Element[] = [];

    if (this.order && this.map) {
      if (this.order.journey) {
        this.order.journey.passages.map((passage, index) => {
          markers.push(
            <JourneyStopMarker
              key={`Passage-${passage.slug}-start`}
              position={passage.pickup.position.toGoogleLatLng()}
              stopNumber={index + 1}
            />
          );

          if (index === this.order!.journey!.passages.length - 1) {
            markers.push(
              <JourneyStopMarker
                key={`Passage-${passage.slug}-end`}
                position={passage.delivery.position.toGoogleLatLng()}
                stopNumber={index + 2}
              />
            );
          }
        });
      } else {
        if (this.order.consignor.location.position) {
          markers.push(
            <JourneyStopMarker
              key="pickup"
              position={this.order.consignor.location.position.toGoogleLatLng()}
              stopNumber={1}
            />
          );
        }
        if (this.order.consignee.location.position) {
          markers.push(
            <JourneyStopMarker
              key="delivery"
              position={this.order.consignee.location.position.toGoogleLatLng()}
              stopNumber={2}
            />
          );
        }
      }
    }

    return markers;
  }

  get polylines(): JSX.Element {
    var positions: google.maps.LatLng[] = [];

    if (this.order && this.map) {
      if (this.order.journey) {
        this.order.journey.passages.map((passage, index) => {
          positions.push(passage.pickup.position.toGoogleLatLng());

          if (index === this.order!.journey!.passages.length - 1) {
            positions.push(passage.delivery.position.toGoogleLatLng());
          }
        });
      } else {
        if (
          this.order.consignor.location.position &&
          this.order.consignee.location.position
        ) {
          positions.push(
            this.order.consignor.location.position.toGoogleLatLng()
          );
          positions.push(
            this.order.consignee.location.position.toGoogleLatLng()
          );
        }
      }
    }

    return <PassageLine coordinates={positions} />;
  }
}
