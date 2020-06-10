import React from "react";
import { observer } from "mobx-react";
import { Order } from "app/model/order";
import { OrderSegmentLine } from "../../features/segment-line/segment-line";
import { OrderStopMarker } from "../../features/stop-marker/stop-marker";

export interface OrderLayerProps
{
    order: Order
}

@observer
export class OrderLayer extends React.Component<OrderLayerProps> {

    public render()
    {
        return (
            <React.Fragment>
                {this.props.order.pickup.location.position && this.props.order.delivery.location.position &&
                    <OrderSegmentLine
                        key={`OrderSegmentLine`}
                        order={this.props.order}
                    />
                }

                {this.props.order.pickup.location.position &&
                    <OrderStopMarker
                        key={`OrderStopMarker-pickup`}
                        stop={this.props.order.pickup}
                    />
                }

                {this.props.order.delivery.location.position &&
                    <OrderStopMarker
                        key={`OrderStopMarker-delivery`}
                        stop={this.props.order.delivery}
                    />
                }
            </React.Fragment>
        );
    }
}
