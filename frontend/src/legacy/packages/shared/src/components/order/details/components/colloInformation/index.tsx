import React from "react";
import { observer } from "mobx-react";
import { Collo } from "shared/src/model/logistics/order";
import Localization from "shared/src/localization";
import { orderDetailsStore } from "../..";

interface Props {
  selectedCollo: Collo;
}

interface State {
  selectedCollo: Collo;
}

@observer
export default class ColloDetailsComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCollo: props.selectedCollo
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      selectedCollo: nextProps.selectedCollo
    });
  }

  renderOrderInstructions() {
    return (
      <div className="c-orderDetails-instructions">
        <div className="c-orderDetails-pickupInstructions c-orderDetails-instruction">
          <div className="font-heading">
            {Localization.operationsValue(
              "Order_OrderDetails_PickupInstructions"
            )}
          </div>
          <div className="p">
            {orderDetailsStore.order!.pickupInstructions
              ? orderDetailsStore.order!.pickupInstructions
              : Localization.operationsValue(
                  "Order_OrderDetails_NoInstructions"
                )}
          </div>
        </div>
        <div className="c-orderDetails-deliveryInstructions c-orderDetails-instruction">
          <div className="font-heading">
            {Localization.operationsValue(
              "Order_OrderDetails_DeliveryInstructions"
            )}
          </div>
          <div className="p">
            {orderDetailsStore.order!.deliveryInstructions
              ? orderDetailsStore.order!.deliveryInstructions
              : Localization.operationsValue(
                  "Order_OrderDetails_NoInstructions"
                )}
          </div>
        </div>
      </div>
    );
  }

  renderColloDetails(collo: Collo) {
    return (
      <div className="c-colloDetails-details">
        <div className="c-colloDetails-info">
          <div className="font-heading">
            {Localization.operationsValue("Order_ColloDetails_Headline")}
          </div>
          <div>
            {Localization.operationsValue("Order_ColloDetails_Barcode", {
              barcode: collo.barcode
            })}
          </div>
        </div>
        {/* TODO: Collo dimensions */}
      </div>
    );
  }

  render() {
    return (
      <div className="c-colloDetails user-select-text">
        {orderDetailsStore.order!.estimatedColli.length > 0 &&
          this.renderColloDetails(this.state.selectedCollo)}
        {this.renderOrderInstructions()}
      </div>
    );
  }
}
