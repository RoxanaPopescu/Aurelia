import React from "react";
import { observer } from "mobx-react";
import { SpecialArea } from "app/model/_route-planning-settings";
import { Polygon } from "react-google-maps";

export interface AreaLayerProps
{
    index: number;
    area: SpecialArea
    onClick?: (area: SpecialArea) => void;
    onMouseEnter?: (area: SpecialArea) => void;
    onMouseLeave?: (area: SpecialArea) => void;
}

@observer
export class AreaLayer extends React.Component<AreaLayerProps> {

    public render()
    {
        return (
            <React.Fragment>

                <Polygon
                    onClick={() => this.props.onClick?.(this.props.area)}
                    onMouseOver={() => this.props.onMouseEnter?.(this.props.area)}
                    onMouseOut={() => this.props.onMouseLeave?.(this.props.area)}
                    key={`polygon-${this.props.index}`}
                    path={this.props.area.polygon.coordinates[0].map(pos => ({ lng: pos[0], lat: pos[1] }))}
                    options={{
                        geodesic: false,
                        strokeColor: "black",
                        fillColor: "rgba(0, 22, 46, 0.6)",
                        strokeWeight: 3,
                        zIndex: 1
                    }}
                />);

            </React.Fragment>
        );
    }
}
