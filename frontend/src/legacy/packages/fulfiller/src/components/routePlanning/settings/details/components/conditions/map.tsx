import React from "react";
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Polygon,
  Marker
} from "react-google-maps";
import { MapStyles } from "shared/src/webKit";
import { observer } from "mobx-react";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import { SpecialCondition } from "shared/src/model/logistics/routePlanning/settings";
import { RoutePlanningSettingsStore } from "../../store";

interface Props {
  store: RoutePlanningSettingsStore;
}

@observer
class Map extends React.Component<Props> {
  render() {
    return (
      <GoogleMap
        ref={(ref: GoogleMap) => {
          this.props.store.mapLoaded(ref);
        }}
        defaultZoom={8}
        defaultCenter={new google.maps.LatLng(55.6881228, 12.5665647)}
        options={{
          disableDefaultUI: false,
          clickableIcons: false,
          styles: MapStyles
        }}
      >
        {(this.props.store.mode === "drawing" ||
          this.props.store.mode === "drawingComplete" ||
          this.props.store.mode === "assigningSettings") && (
          <DrawingManager
            onPolygonComplete={polygon => {
              this.props.store.completedDrawing(polygon);

              // this.props.store.drawingManager!.setDrawingMode(null);
            }}
            drawingMode={
              this.props.store.mode === "drawingComplete"
                ? undefined
                : google.maps.drawing.OverlayType.POLYGON
            }
            defaultOptions={{
              drawingControl: false,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [google.maps.drawing.OverlayType.POLYGON]
              },
              polygonOptions: {
                strokeWeight: 2,
                strokeColor: "#1a6bc6",
                fillColor: "rgba(253, 255, 97, 0.9)",
                clickable: false,
                editable: true,
                zIndex: 1
              }
            }}
          />
        )}
        {this.renderPolygons()}
      </GoogleMap>
    );
  }

  renderPolygons() {
    let elements: JSX.Element[] = [];

    this.props.store.setting.parameters.specialConditions.forEach(
      (specialCondition, index) => {
        if (this.props.store.isConditionHidden(specialCondition) === false) {
          let strokeColor: string;
          if (
            this.props.store.highlightedCondition &&
            this.props.store.highlightedCondition === specialCondition
          ) {
            strokeColor = "black";
          } else {
            strokeColor = "#edf2f9";
          }

          elements.push(
            <Polygon
              key={"polygon_" + specialCondition.id}
              path={specialCondition.mapPath}
              options={{
                geodesic: false,
                strokeColor: strokeColor,
                fillColor: "rgba(0, 22, 46, 0.6)",
                strokeWeight: 3,
                zIndex: index
              }}
            />
          );

          elements.push(this.renderMarker(specialCondition, index));
        }
      }
    );

    return elements;
  }

  renderMarker(condition: SpecialCondition, index: number): JSX.Element {
    var bounds = new google.maps.LatLngBounds();
    condition.mapPath.forEach(path => bounds.extend(path));
    return (
      <Marker
        zIndex={index + 100}
        key={"marker_" + condition.id}
        position={bounds.getCenter()}
        label={{ text: String(index + 1), fontSize: "25px", color: "white" }}
        icon={{
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          strokeColor: "transparent",
          scale: 1
        }}
      />
    );
  }
}

export const RoutePlanningSettingsMap = withScriptjs(withGoogleMap(Map));
