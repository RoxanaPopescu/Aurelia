import React from "react";
import { Polyline } from "react-google-maps";

// The width of the stroke, in pixels.
const strokeWeight = 2;

// The opacity of the stroke, in the range [0.0, 1.0].
const strokeOpacity = 1.0;

export interface PassageLineProps {
  coordinates: google.maps.LatLng[] | google.maps.LatLngLiteral[];
}

export class PassageLine extends React.Component<PassageLineProps> {
  public render() {
    const options = this.getPolylineOptions();

    return <Polyline path={this.props.coordinates} options={options} />;
  }

  private getPolylineOptions(): google.maps.PolylineOptions {
    // if (
    //   this.props.coordinates[0].status.slug !== "not-visited" &&
    //   this.props.coordinates[1].status.slug !== "not-visited"
    // ) {
    //   return {
    //     strokeColor: "#17C800",
    //     strokeWeight,
    //     strokeOpacity,
    //     icons: []
    //   };
    // }

    return {
      strokeColor: "gray",
      strokeWeight,
      strokeOpacity: 0,
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
