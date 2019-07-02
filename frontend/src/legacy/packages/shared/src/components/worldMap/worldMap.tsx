import React from "react";
import { ComponentClass } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  GoogleMapProps
} from "react-google-maps";
import { MapConstants, MapStyles } from "shared/src/webKit";
import "./worldMap.scss";

function withWorldMap(map: ComponentClass) {
  const WrappedMap = withScriptjs(withGoogleMap(map));
  return class extends React.Component {
    public render() {
      return (
        <WrappedMap
          googleMapURL={MapConstants.url("3.35")}
          loadingElement={<div className="c-worldMap c-worldMap-loading" />}
          containerElement={<div className="c-worldMap" />}
          mapElement={<div style={{ position: "absolute", width: "100%", height: "100%" }} />}
          {...this.props}
        >
          {this.props.children}
        </WrappedMap>
      );
    }
  };
}

export interface WorldMapComponentProps extends GoogleMapProps {
  onMapReady?: (map: GoogleMap) => void;
}

export class WorldMapComponent extends React.Component<WorldMapComponentProps> {

  private isReady = false;
  
  public render() {
    return (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(55.6881228, 12.5665647)}
        {...this.props}
        options={{
          disableDefaultUI: false,
          clickableIcons: false,
          styles: MapStyles,
          scrollwheel: false,
          ...this.props.options
        }}
        ref={map => {
          if (!this.isReady && this.props.onMapReady && map !== null) {
            this.isReady = true;
            this.props.onMapReady(map);
          }
        }}
      >
        {this.props.children}
      </GoogleMap>
    );
  }
}

export const WorldMap: typeof WorldMapComponent = withWorldMap(
  WorldMapComponent
  // tslint:disable-next-line:no-any
) as any;
