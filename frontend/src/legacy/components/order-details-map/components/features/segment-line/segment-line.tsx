import React from "react";
import { Polyline } from "react-google-maps";
import { Order } from "app/model/order";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface OrderSegmentLineProps {
  order: Order;
  onClick?: () => void;
  faded?: boolean;
}

export class OrderSegmentLine extends React.Component<OrderSegmentLineProps> {
  public render() {
    const positions: google.maps.LatLng[] = [this.props.order.pickup.location.position!.toGoogleLatLng(), this.props.order.delivery.location.position!.toGoogleLatLng()];
    const options = this.getPolylineOptions();

    return <>
      <Polyline
        path={positions}
        options={options}
      />
      <Polyline
        path={positions}
        options={{
          strokeColor: "transparent",
          strokeWeight: 9 * strokeWeight,
          zIndex: this.props.faded ? 1 : 101
        }}
        onClick={() => this.props.onClick && this.props.onClick()}
      />
    </>
  }

  private getPolylineOptions(): google.maps.PolylineOptions {
    const strokeOpacity = this.props.faded ? fadedStrokeOpacity : normalStrokeOpacity;
    const color = "gray";

    return {
        clickable: this.props.onClick != null,
        strokeColor: color,
        strokeWeight,
        strokeOpacity,
        zIndex: this.props.faded ? 1 : 100,
        icons: []
      };
  }
}
