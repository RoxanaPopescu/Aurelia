import React from "react";
import { observer } from "mobx-react";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import { getCssVariable } from "legacy/helpers/css-helper";
import { GeoJsonPolygon } from "shared/types";

export interface DrawingLayerProps
{
    onDrawingComplete: (polygon: GeoJsonPolygon) => Promise<void>;
}

@observer
export class DrawingLayer extends React.Component<DrawingLayerProps>
{
    public render = () =>
    {
        return (
            <React.Fragment>

                <DrawingManager
                    onPolygonComplete={async polygon =>
                    {
                        await this.props.onDrawingComplete?.(this.createGeoJsonPolygon(polygon));

                        polygon.setMap(null);
                    }}
                    drawingMode={google.maps.drawing.OverlayType.POLYGON}
                    defaultOptions={
                        {
                            drawingControl: false,
                            drawingControlOptions:
                            {
                                position: google.maps.ControlPosition.TOP_CENTER,
                                drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                            },
                            polygonOptions:
                            {
                                strokeWeight: 2,
                                strokeColor: getCssVariable(`--palette-color-primary`),
                                strokeOpacity: 0.9,
                                fillColor: getCssVariable(`--palette-color-primary`),
                                fillOpacity: 0.4,
                                clickable: false,
                                editable: true,
                                zIndex: 1
                            }
                        }
                    }
                />

            </React.Fragment>
        );
    }

    public createGeoJsonPolygon(polygon: google.maps.Polygon): GeoJsonPolygon
    {
        const positions = polygon.getPath().getArray().map(p => [p.lng(), p.lat() ]);

        return new GeoJsonPolygon([positions])
    }
}
