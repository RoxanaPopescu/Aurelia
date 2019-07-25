import React from "react";
import { Polyline } from "react-google-maps";
import { DriverRouteStop } from "app/model/express-route";
import { RouteStopInfo } from "app/model/route";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface ExpressRouteDeliveryArrowProps {
  routeStops: (DriverRouteStop | RouteStopInfo)[];
  onClick?: () => void;
  faded?: boolean;
}

export class ExpressRouteDeliveryArrow extends React.Component<ExpressRouteDeliveryArrowProps> {
  public render() {
    const positions = this.props.routeStops.map(s =>
      s.location.position!.toGoogleLatLng()
    );
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
          zIndex: 100
        }}
        onClick={() => this.props.onClick && this.props.onClick()}
      />
    </>
  }

  private getPolylineOptions(): google.maps.PolylineOptions {

    const strokeOpacity = this.props.faded ? fadedStrokeOpacity : normalStrokeOpacity;

    return {
      clickable: this.props.onClick != null,
      strokeColor: "gray",
      strokeWeight,
      strokeOpacity: 0,
      zIndex: 101,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity,
            scale: strokeWeight
          },
          offset: "0",
          repeat: `${4 * strokeWeight}px`
        },
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            strokeOpacity
          },
          offset: "100%"
        }
      ]
    };
  }
}
