import React from "react";
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  InfoWindow
} from "react-google-maps";
import { getMapStyles, InfoBox } from "shared/src/webKit";
import { observer } from "mobx-react";
import MapHoverArea from "shared/src/components/map/hoverArea";
import { RoutePlanningStore } from "./store";

interface Props {
  store: RoutePlanningStore;
}

@observer
class Map extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.store.mapCenter = new google.maps.LatLng(55.6881228, 12.5665647);
  }

  render() {
    return (
      <GoogleMap
        ref={(ref: GoogleMap) => {
          this.props.store.mapLoaded(ref);
        }}
        zoom={this.props.store.mapZoom}
        center={this.props.store.mapCenter}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: getMapStyles(),
          minZoom: 2,
          maxZoom: 20,
        }}
        onDragEnd={() => this.props.store.checkBounds()}
        onZoomChanged={() => this.props.store.checkBounds()}
      >
        {this.props.store.polylines}
        {this.props.store.markers}
        {this.props.store.hoveredItem && (
          <InfoWindow
            position={this.props.store.hoveredItem.point}
            options={{
              disableAutoPan: true,
              pixelOffset: new google.maps.Size(
                0,
                this.props.store.hoveredItem.infoWindowOffset
              )
            }}
          >
            <MapHoverArea
              onMouseEnter={owner => {
                if (this.props.store.hoveredItem) {
                  this.props.store.hoveredItem.mouseOwner = owner;
                }
              }}
              onMouseLeave={owner => {
                if (
                  this.props.store.hoveredItem &&
                  this.props.store.hoveredItem.mouseOwner === owner
                ) {
                  this.props.store.hoveredItem = undefined;
                }
              }}
            >
              <InfoBox
                color={this.props.store.hoveredItem.color}
                headline={this.props.store.hoveredItem.title}
                rows={this.props.store.hoveredItem.rows}
              >
                {this.props.store.hoveredItem.subTitle && (
                  <h4>{this.props.store.hoveredItem.subTitle}</h4>
                )}
              </InfoBox>
            </MapHoverArea>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }
}

export const RoutePlanningMap = withScriptjs(withGoogleMap(Map));
