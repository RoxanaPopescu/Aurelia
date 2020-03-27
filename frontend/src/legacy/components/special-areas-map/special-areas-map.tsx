import React from "react";
import { GoogleMap } from "react-google-maps";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Button, ButtonType } from "shared/src/webKit";
import { GeoJsonPolygon } from "shared/types";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { SpecialArea } from "app/model/_route-planning-settings";
import { AreaLayer } from "./components/area-layer/area-layer";
import { DrawingLayer } from "./components/drawing-layer/drawing-layer";
import "./special-areas-map.scss";

export interface ISpecialAreasMapProps
{
    areas: SpecialArea[];
    enableDrawing: boolean;
    onMapClick?: () => void;
    onAreaClick?: (area: SpecialArea) => void;
    onAreaMouseEnter?: (area: SpecialArea) => void;
    onAreaMouseLeave?: (area: SpecialArea) => void;
    onDrawingComplete: (polygon: GeoJsonPolygon) => Promise<void>;
    onDrawingCancelled: () => void;
}

/**
 * Represents a world map that shows the special areas within a route planning rule set.
 */
@observer
export class SpecialAreasMapComponent extends React.Component<ISpecialAreasMapProps>
{
    /**
     * Creates a new instance of the class.
     * @param props The props for the component.
     */
    public constructor(props: any)
    {
        super(props);
    }

    private map: GoogleMap | undefined;
    private hasFittedBounds = false;

    @observable
    private hideMessage = false;

    public render()
    {
        this.fitBoundsOnLoad();

        return (
            <div className="special-areas-map">

                <div className="special-areas-map-buttons">

                    <Button
                        type={ButtonType.Light}
                        onClick={() => this.tryFitBounds()}>
                        Zoom to fit
                    </Button>

                    {this.props.enableDrawing && !this.hideMessage &&
                    <div className="special-areas-map-message">

                        Draw an area by clicking points on the map…

                        <a
                            onClick={() => this.props.onDrawingCancelled()}>
                            Cancel
                        </a>

                    </div>}

                </div>

                <WorldMap
                    options={{ scrollwheel: false }}
                    onClick={() =>this.props.onMapClick?.()}
                    onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                        {this.props.enableDrawing &&
                        <DrawingLayer
                            onDrawingComplete={async polygon =>
                            {
                                this.hideMessage = true;
                                await this.props.onDrawingComplete(polygon);
                                this.hideMessage = false;
                            }}>
                        </DrawingLayer>}

                        {this.props.areas?.map((area, index) =>
                            <AreaLayer
                                area={area}
                                index={index}
                                key={index}
                                onClick={() => this.props.onAreaClick?.(area)}
                                onMouseEnter={() => this.props.onAreaMouseEnter?.(area)}
                                onMouseLeave={() => this.props.onAreaMouseLeave?.(area)}>
                            </AreaLayer>
                        )}

                </WorldMap>

            </div>
        );
    }

    private fitBoundsOnLoad(): void
    {
        if (
            !this.hasFittedBounds &&
            this.map &&
            this.props.areas)
        {
            this.hasFittedBounds = true;
            this.tryFitBounds();
            setTimeout(() => this.tryFitBounds(), 50);
        }
    }

    private tryFitBounds(): void
    {
        if (this.map == null || this.props.areas.length === 0)
        {
            return;
        }

        const routeBounds = new google.maps.LatLngBounds();

        for (const area of this.props.areas)
        {
            for (const pos of area.polygon.coordinates[0])
            {
                routeBounds.extend({ lng: pos[0], lat: pos[1] });
            }
        }

        (this.map.fitBounds as Function)(routeBounds, 50);
    }
}
