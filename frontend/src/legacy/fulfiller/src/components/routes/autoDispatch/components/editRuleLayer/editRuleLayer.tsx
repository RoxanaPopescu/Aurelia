import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import Localization from "shared/src/localization";
import { Button, ButtonType } from "shared/src/webKit";
import { AutoDispatchRule, AutoDispatchRulePolygon } from "../../services/autoDispatchService";
import "./editRuleLayer.scss";

export interface Props {
  rule: AutoDispatchRule;
  onSave: () => Promise<void>;
}

type DrawingMode = "ready" | "drawing" | "complete";

@observer
export class EditRuleLayerComponent extends React.Component<Props> {

  @observable
  private mode: DrawingMode = "ready";

  private polygons: google.maps.Polygon[] = [];

  public componentWillReceiveProps(props: Props): void {
    if (props.rule !== this.props.rule) {
      this.reset();
    }
  }
  
  public render() {

    return (
      <React.Fragment>

        {(this.mode === "drawing" || this.mode === "complete") &&
        <DrawingManager
          onPolygonComplete={polygon => {
            this.polygons.push(polygon);
            this.mode = "complete";
          }}
          drawingMode={google.maps.drawing.OverlayType.POLYGON}
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
              editable: false,
              zIndex: 1000
            }
          }}
        />}
        
        <div className="c-autoDispatch-editRuleLayer-actions">
          
          {this.mode === "ready" &&
          <Button type={ButtonType.Action} onClick={() => this.onDrawNewArea()}>
            {Localization.operationsValue("Routes_AutoDispatch_Map_DrawNewArea")}
          </Button>}

          {this.mode !== "ready" &&
          <Button type={ButtonType.Action} onClick={() => this.reset()}>
            {Localization.operationsValue("Routes_AutoDispatch_Map_CancelDrawNewArea")}
          </Button>}

          {this.mode === "complete" &&
          <Button type={ButtonType.Action} onClick={() => this.onSaveNewArea()}>
            {Localization.operationsValue("Routes_AutoDispatch_Map_SaveNewArea")}
          </Button>}

        </div>

      </React.Fragment>
    );
  }

  private onDrawNewArea(): void {
    this.mode = "drawing";
  }

  private async onSaveNewArea(): Promise<void> {
    const originalPolygons = this.props.rule.conditions.polygons;

    this.props.rule.conditions.polygons = this.polygons
      .map(p => new AutoDispatchRulePolygon(p));
    
    try {
      await this.props.onSave();
      this.reset();
    } catch (error) {
      alert("Error: Could not save the new area.");
      this.props.rule.conditions.polygons = originalPolygons;
    }
  }

  private reset() {
    this.polygons.forEach(p => p.setMap(null));
    this.polygons = [];
    this.mode = "ready";
  }
}
