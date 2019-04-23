import React from "react";
import "./styles.scss";
import { RoutePlanningSettingsMap } from "./map";
import { RoutePlanningSettingsStore } from "../../store";
import { observer } from "mobx-react";
import { MapConstants, ButtonType, Button } from "shared/src/webKit";
import ListElementComponent from "./listElement";
import InfoComponent from "shared/src/webKit/info";
import { ButtonSize } from "shared/src/webKit/button";

interface Props {
  store: RoutePlanningSettingsStore;
}

@observer
export default class AreasComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.store.zoom();
  }

  renderMapButtons() {
    let buttons: JSX.Element[] = [];

    if (this.props.store.mode === "drawingComplete") {
      buttons.push(
        <Button
          onClick={() => {
            if (window.confirm("Sikker på du vil fjerne denne tegning?")) {
              this.props.store.clearDrawing();
            }
          }}
          key="mapDrawingClear"
          type={ButtonType.Neutral}
          size={ButtonSize.Medium}
        >
          Ryd tegningen
        </Button>
      );

      buttons.push(
        <Button
          onClick={() => {
            this.props.store.mode = "assigningSettings";
          }}
          key="mapDrawingAssign"
          type={ButtonType.Action}
          size={ButtonSize.Medium}
        >
          Accepter tegning
        </Button>
      );
    } else if (this.props.store.mode === "drawing") {
      buttons.push(
        <div
          key="drawing-info"
          className="c-routePlanning-settings-details-drawingOnMap"
        >
          Indtegn et område ved at trykke på kortet.
        </div>
      );
    } else if (this.props.store.mode === "idle") {
      buttons.push(
        <Button
          onClick={() => {
            this.props.store.mode = "drawing";
          }}
          key="mapDrawingIdle"
          type={ButtonType.Action}
          size={ButtonSize.Medium}
        >
          Indtegn nyt område
        </Button>
      );
    }

    return (
      <div className="c-routePlanning-settings-details-mapInfoTop">
        {buttons}
      </div>
    );
  }

  render() {
    return (
      <div className="c-routePlanning-settings-details">
        <div className="c-routePlanning-settings-details-mapContainer">
          <RoutePlanningSettingsMap
            store={this.props.store}
            googleMapURL={MapConstants.url()}
            loadingElement={<div style={{ display: "flex", flex: 1 }} />}
            containerElement={<div style={{ display: "flex", flex: 1 }} />}
            mapElement={<div style={{ display: "flex", flex: 1 }} />}
          />
          {this.renderMapButtons()}
        </div>
        <div className="c-routePlanning-settings-details-areas">
          {this.props.store.setting.parameters.specialConditions.map(
            (condition, index) => (
              <ListElementComponent
                key={condition.id}
                index={index}
                condition={condition}
                store={this.props.store}
              />
            )
          )}
          {this.props.store.setting.parameters.specialConditions.length <=
            0 && (
            <InfoComponent
              title="Indtegn et område på kortet du ønsker at 
tilføje indstillinger til."
              image={require("./assets/drawArea.svg")}
            />
          )}
        </div>
      </div>
    );
  }
}
