import React from "react";
import { observer } from "mobx-react";
import { AutoDispatchRule } from "../../services/autoDispatchService";
import { Polygon } from "react-google-maps";

export interface Props {
  rule: AutoDispatchRule;
  selected: boolean;
  onClick: (event: google.maps.PolyMouseEvent) => void;
}

@observer
export class RuleLayerComponent extends React.Component<Props> {

  public render() {

    return (
      <React.Fragment>
        {this.props.rule.conditions.polygons && this.props.rule.conditions.polygons.map((polygon, index) => 
          <Polygon
            key={`polygon_${this.props.rule.id}_${index}`}
            path={polygon.positions.map(p => p.toGoogleLatLng())}
            options={{
              geodesic: false,
              strokeColor: "#edf2f9",
              fillColor: this.props.selected ? "rgba(0, 22, 46, 0.9)" : "rgba(0, 22, 46, 0.5)",
              strokeWeight: 3,
              zIndex: index
            }}
            onClick={this.props.onClick}
          />
        )}
      </React.Fragment>
    );
  }
}
