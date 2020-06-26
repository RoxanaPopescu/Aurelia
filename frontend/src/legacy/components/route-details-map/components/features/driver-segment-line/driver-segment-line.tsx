import React from "react";
import { Polyline } from "react-google-maps";
import { Position } from "app/model/shared";

// The width of the stroke, in pixels.
const strokeWeight = 1;

// The opacity of the stroke, in the range [0.0, 1.0].
const normalStrokeOpacity = 0.9;
const fadedStrokeOpacity = 0.1;

export interface RouteSegmentLineProps {
  positions: Position [];
  onClick?: () => void;
  faded?: boolean;
}

export class DriverSegmentLine extends React.Component<RouteSegmentLineProps> {
  public render() {
    const position = this.props.positions.map(p => p.toGoogleLatLng());
    const options = this.getPolylineOptions();

    return <>
      <Polyline
        path={position}
        options={options}
      />
      <Polyline
        path={position}
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

    return {
      clickable: this.props.onClick != null,
      strokeColor: "#ccc",
      strokeWeight,
      strokeOpacity,
      zIndex: this.props.faded ? 1 : 100,
      icons: []
    }
  }
}
