import React from "react";
import { Polyline } from "react-google-maps";
import { DriverRouteStop } from "app/model/express-route";
import { RouteStopInfo } from "app/model/route";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface DriverRouteSegmentLineProps {
  routeStops: (DriverRouteStop | RouteStopInfo)[];
  onClick?: () => void;
  faded?: boolean;
}

export class DriverRouteSegmentLine extends React.Component<DriverRouteSegmentLineProps> {
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

    if (
      this.props.routeStops[0].status.slug !== "not-visited" &&
      this.props.routeStops[1].status.slug !== "not-visited"
    ) {
      return {
        clickable: this.props.onClick != null,
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
      clickable: this.props.onClick != null,
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
