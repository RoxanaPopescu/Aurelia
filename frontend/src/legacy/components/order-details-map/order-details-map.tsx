import React from "react";
import { GoogleMap } from "react-google-maps";
import { observer } from "mobx-react";
import { Button, ButtonType } from "shared/src/webKit";
import { WorldMap } from "shared/src/components/worldMap/worldMap";
import { OrderLayer } from "./components/layers/order-layer/order-layer";
import "./order-details-map.scss";
import { OrderNew } from 'app/model/order';

export interface IOrderDetailsMapProps
{
    order?: OrderNew;
    onOrderClick: (order: OrderNew) => void;
    onStopClick?: (order: OrderNew) => void;
    onMapClick?: () => void;
}

/**
 * Represents a world map that shows the order on a order details page.
 */
@observer
export class OrderDetailsMapComponent extends React.Component<IOrderDetailsMapProps>
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
            <div className="orderDetails-map">

                <div className="orderDetails-map-buttons">

                    <Button
                        className="orderDetails-map-fit-button"
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

                    {this.props.order != null &&
                    <OrderLayer
                        key={`RouteLayer-${this.props.order.id}`}
                        order={this.props.order}
                        onOrderClick={(order) => this.props.onOrderClick?.(order)}
                        onStopClick={(order) => this.props.onStopClick?.(order)}
                    />}

                </WorldMap>

            </div>
        );
    }

    private fitBoundsOnLoad(): void
    {
        if (
            !this.hasFittedBounds &&
            this.map &&
            this.props.order)
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

        const orderBounds = new google.maps.LatLngBounds();

        if (this.props.order)
        {
            // orderBounds.extend(this.props.order.pickup.location.position!.toGoogleLatLng());
            // orderBounds.extend(this.props.order.delivery.location.position!.toGoogleLatLng());
        }

        (this.map.fitBounds as Function)(orderBounds, 50);
    }
}
