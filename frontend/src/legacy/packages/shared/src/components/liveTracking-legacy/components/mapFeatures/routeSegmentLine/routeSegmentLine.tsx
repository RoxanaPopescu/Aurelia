import React from "react";
import { Polyline } from "react-google-maps";
import { RouteStopBase } from "shared/src/model/logistics/routes";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const strokeOpacity = 0.4;

export interface RouteSegmentLineProps {
  routeStops: (RouteStopBase)[];
}

export class RouteSegmentLine extends React.Component<RouteSegmentLineProps> {
  public render() {
    const positions = this.props.routeStops.map(s =>
      s.location.position!.toGoogleLatLng()
    );
    const options = this.getPolylineOptions();

    return <Polyline path={positions} options={options} />;
  }

  private getPolylineOptions(): google.maps.PolylineOptions {
    if (
      this.props.routeStops[0].status.slug !== "not-visited" &&
      this.props.routeStops[1].status.slug !== "not-visited"
    ) {
      return {
        strokeColor: "#17C800",
        strokeWeight,
        strokeOpacity,
        zIndex: 100,
        icons: []
      };
    }

    const color =
      this.props.routeStops[0].status.slug !== "not-visited" &&
      this.props.routeStops[0].status.slug !== "arrived"
        ? "#17C800"
        : "gray";

    return {
      strokeColor: color,
      strokeWeight,
      strokeOpacity: 0,
      zIndex: 1,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity,
            scale: strokeWeight
          },
          offset: "0",
          repeat: `${4 * strokeWeight}px`
        }
      ]
    };
  }
}
