import React from "react";
import "./marker.scss";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
// import { InfoWindow } from "react-google-maps";

interface Props {
  position: google.maps.LatLng;
}

interface State {
  showInfoWindow: boolean;
}

const defaultHeight = 35;
const defaultWidth = 28;
const hoverHeight = defaultHeight + 248;
const hoverWidth = 232;

export default class MarkerComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showInfoWindow: false
    };
  }

  renderInfoWindow() {
    return (
      <div className="c-infoWindow">
        <div className="c-infoWindow-top" />
        <div className="c-infoWindow-content" />
      </div>
    );
  }

  render() {
    if (this.state.showInfoWindow === true) {
      return (
        <MarkerWithLabel
          icon={{
            path: `M0 0 H ${defaultWidth} V ${defaultHeight} H 0 L 0 0`,
            strokeWeight: 0,
            scale: 1
          }}
          position={this.props.position}
          labelAnchor={new google.maps.Point(defaultWidth / 2, defaultHeight)}
          labelStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer"
          }}
          labelClass="c-mapMarker"
          onMouseOver={() => {
            this.setState({ showInfoWindow: true });
          }}
          onMouseOut={() => this.setState({ showInfoWindow: false })}
        >
          <div className="c-marker-icon">
            <div className="c-marker-top" />
            <div className="c-marker-line" />
            <div className="c-marker-bottom" />
          </div>
        </MarkerWithLabel>
      );
    } else {
      return (
        <MarkerWithLabel
          icon={{
            path: `M0 0 H ${hoverWidth} V ${hoverHeight} H 0 L 0 0`,
            strokeWeight: 0,
            scale: 1
          }}
          position={this.props.position}
          labelAnchor={new google.maps.Point(hoverWidth / 2, hoverHeight)}
          labelStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer"
          }}
          labelClass="c-mapMarker"
          onMouseOver={() => {
            this.setState({ showInfoWindow: true });
          }}
          onMouseOut={() => this.setState({ showInfoWindow: false })}
        >
          <div className="c-marker-icon">
            {this.renderInfoWindow()}
            <div className="c-marker-top" />
            <div className="c-marker-line" />
            <div className="c-marker-bottom" />
          </div>
        </MarkerWithLabel>
      );
    }
  }
}
