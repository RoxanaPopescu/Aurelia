import React from "react";
import { Polyline } from "react-google-maps";
import { DriverRouteStop } from "app/model/express-route";
import { RouteStopInfo } from "app/model/route";
import { Position } from "app/model/shared";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface DriverRouteSegmentLineProps {
  routeStops: (Position | DriverRouteStop | RouteStopInfo)[];
  onClick?: () => void;
  faded?: boolean;
}

export class DriverRouteSegmentLine extends React.Component<DriverRouteSegmentLineProps> {
  public render() {
    const positions = this.props.routeStops.map(s =>
      s instanceof Position ? s.toGoogleLatLng() : s.location.position!.toGoogleLatLng()
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
          zIndex: this.props.faded ? 1 : 101
        }}
        onClick={() => this.props.onClick && this.props.onClick()}
      />
    </>
  }

  private getPolylineOptions(): google.maps.PolylineOptions {

    const strokeOpacity = this.props.faded ? fadedStrokeOpacity : normalStrokeOpacity;

    const a = this.props.routeStops[0];
    const b = this.props.routeStops[1];

    if (
      !(a instanceof Position) &&
      !(b instanceof Position) &&
      a.status.slug !== "not-visited" &&
      b.status.slug !== "not-visited"
    ) {
      return {
        clickable: this.props.onClick != null,
        strokeColor: "#17C800",
        strokeWeight,
        strokeOpacity,
        zIndex: this.props.faded ? 1 : 100,
        icons: []
      };
    }

    const color =
      a instanceof Position ? "#17C800" :
      a.status.slug !== "not-visited" &&
      a.status.slug !== "arrived"
        ? "#17C800"
        : "gray";

    return {
        clickable: this.props.onClick != null,
        strokeColor: color,
        strokeWeight,
        strokeOpacity,
        zIndex: this.props.faded ? 1 : 100,
        icons: []
      };

    // return {
    //   clickable: this.props.onClick != null,
    //   strokeColor: color,
    //   strokeWeight,
    //   strokeOpacity: 0,
    //   zIndex: 1,
    //   icons: [
    //     {
    //       icon: {
    //         path: "M 0,-1 0,1",
    //         strokeOpacity,
    //         scale: strokeWeight
    //       },
    //       offset: "0",
    //       repeat: `${4 * strokeWeight}px`
    //     }
    //   ]
    // };
  }
}
