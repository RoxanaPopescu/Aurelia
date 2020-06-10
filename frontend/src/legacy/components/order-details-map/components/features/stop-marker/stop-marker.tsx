import React from "react";
import { observer } from "mobx-react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Marker } from "shared/src/components/worldMap";
import "./stop-marker.scss";
import { OrderStop } from "app/model/order/entities/order-stop";

export interface OrderStopMarkerProps
{
    stop: OrderStop;
    onClick?: () => void;
    faded?: boolean;
}

@observer
export class OrderStopMarker extends Marker<OrderStopMarkerProps>
{
    public constructor(props: OrderStopMarkerProps)
    {
        super(props);
    }

    protected renderMarker()
    {
        const position = this.props.stop.location.position!.toGoogleLatLng();
        const labelText = `${this.props.stop.location.address.toString().substr(0,4)}`;

        return (
            <MarkerWithLabel
                icon=" "
                labelAnchor={new google.maps.Point(26, 17)}
                position={position}
                zIndex={3}
                onClick={() => this.props.onClick && this.props.onClick()}>

                <React.Fragment>

                    <div className={`orderDetails-orderStopMarker ${this.props.faded ? "--faded" : ""}`}>
                        <div className={`
                            orderDetails-orderStopMarker-shape`}>
                            {labelText}
                        </div>
                    </div>

                </React.Fragment>
            </MarkerWithLabel>
        );
    }
}
