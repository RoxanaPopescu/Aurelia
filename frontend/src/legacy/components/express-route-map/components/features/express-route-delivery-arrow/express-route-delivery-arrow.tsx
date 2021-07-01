import React from "react";
import { Polyline } from "react-google-maps";
import { ExpressRouteStop } from "app/model/express-route";
import { accentColors } from "legacy/components/express-route-map/accent-colors";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface ExpressRouteDeliveryArrowProps {
  routeStops: ExpressRouteStop[];
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
          zIndex: this.props.faded ? 2 : 202
        }}
        onClick={() => this.props.onClick && this.props.onClick()}
      />
    </>
  }

  private getPolylineOptions(): google.maps.PolylineOptions {

    const strokeOpacity = this.props.faded ? fadedStrokeOpacity : normalStrokeOpacity;

    return {
      clickable: this.props.onClick != null,
      strokeColor: this.props.faded ? "gray" : accentColors[this.props.routeStops[0].route.colorIndex ?? 0] || "gray",
      strokeWeight,
      strokeOpacity: 0,
      zIndex: this.props.faded ? 2 : 102,
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
