import React from "react";
import { GoogleMap } from "react-google-maps";
import { observer } from "mobx-react";
import { Button, ButtonType } from "shared/src/webKit";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { SpecialArea } from "app/model/_route-planning-settings";
import "./special-areas-map.scss";
import { AreaLayer } from "./components/area-layer/area-layer";

export interface ISpecialAreasMapProps
{
    areas: SpecialArea[];
    onMapClick?: () => void;
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

    public render()
    {
        this.fitBoundsOnLoad();

        return (
            <div className="special-areas-map">

                <div className="special-areas-map-buttons">

                    <Button
                        className="special-areas-map-fit-button"
                        type={ButtonType.Light}
                        onClick={() => this.tryFitBounds()}>
                        Zoom to fit
                    </Button>

                </div>

                <WorldMap
                    options={{ scrollwheel: false }}
                    onClick={() =>this.props.onMapClick?.()}
                    onMapReady={map =>
                    {
                        this.map = map;
                        this.fitBoundsOnLoad();
                    }}>

                        {this.props.areas?.map((area, index) =>
                            <AreaLayer area={area} index={index} key={index}></AreaLayer>
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
        }
    }

    private tryFitBounds(): void
    {
        if (this.map == null)
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
