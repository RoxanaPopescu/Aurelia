import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { Order, Collo } from "shared/src/model/logistics/order";
import Localization from "shared/src/localization";
import { orderDetailsStore } from "../..";
import Constants from "shared/src/utillity/constants";
import { ColloStatus } from "shared/src/model/logistics/colloStatus";

interface Props {
  selectedCollo: Collo;
  colloSelected(collo: Collo);
}

interface State {
  selectedCollo: Collo;
  shownColliTab: "Actual" | "Estimated";
}

@observer
export default class OrderDetailsMetaComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCollo: props.selectedCollo,
      shownColliTab: "Actual"
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      selectedCollo: nextProps.selectedCollo
    });
  }

  metaRow(headline: string, value: string) {
    return (
      <div className="c-orderDetails-row">
        <div>{headline}</div>
        <div>{value}</div>
      </div>
    );
  }

  renderOrderInformations(order: Order) {
    return (
      <div className="c-orderDetails-info c-orderDetails-section">
        <div className="font-heading c-orderDetails-headline">
          {Localization.operationsValue("Order_Details_Information_Headline")}
        </div>
        {this.metaRow(
          Localization.operationsValue("Order_Details_Information_Id"),
          order.publicOrderId
        )}
        {this.metaRow(
          Localization.operationsValue("Order_Details_Information_State"),
          order.state.status.name
        )}
        {/* {this.metaRow(
          Localization.operationsValue("Order_Details_EstimatedArrival"),
          ""
        )} */}
      </div>
    );
  }

  renderColli(actualColli: Collo[], estimatedColli: Collo[]) {
    var colliToRender =
      this.state.shownColliTab === "Actual" ? actualColli : estimatedColli;

    return (
      <div className="c-orderDetails-colli c-orderDetails-section">
        {(actualColli.length > 0 || estimatedColli.length > 0) && (
          <div className="c-orderDetails-tabs">
            <h4
              className={`c-orderDetails-tab${
                this.state.shownColliTab === "Actual" ? " dark active" : ""
              }`}
              onClick={() => this.setState({ shownColliTab: "Actual" })}
            >
              {Localization.operationsValue(
                "Order_Details_ActualColli"
              ).replace(
                "{colliCount}",
                orderDetailsStore.order!.actualColli.length.toString()
              )}
            </h4>
            <h4
              className={`c-orderDetails-tab${
                this.state.shownColliTab === "Actual" ? "" : " dark active"
              }`}
              onClick={() => this.setState({ shownColliTab: "Estimated" })}
            >
              {Localization.operationsValue(
                "Order_Details_EstimatedColli"
              ).replace(
                "{colliCount}",
                orderDetailsStore.order!.estimatedColli.length.toString()
              )}
            </h4>
          </div>
        )}
        <h4 className="font-heading c-orderDetails-headline">
          {Localization.operationsValue("Order_Details_ColliOverview")}
        </h4>
        {(colliToRender.length > 0 && (
          <div className="c-orderDetails-colliContainer">
            <div className="c-orderDetails-colliInnerContainer">
              {colliToRender.map(collo => this.getColloInformation(collo))}
            </div>
          </div>
        )) || (
          <div>
            {this.state.shownColliTab === "Actual"
              ? Localization.operationsValue("Order_Details_NoActualColli")
              : Localization.operationsValue("Order_Details_NoEstimatedColli")}
          </div>
        )}
      </div>
    );
  }

  getColloInformation(collo: Collo) {
    var className = "c-orderDetails-collo";
    if (collo.barcode === this.state.selectedCollo.barcode) {
      className += " active";
    }

    var status: ColloStatus | undefined = undefined;
    if (
      orderDetailsStore.journey &&
      orderDetailsStore.routeDetailsService.routeDetails
    ) {
      orderDetailsStore.journey.passages.map((passage, index) => {
        if (index !== 0) {
          return;
        }
        if (passage.pickupStop) {
          passage.pickupStop.pickups.map(p =>
            p.colli.map(c => {
              if (c.barcode === collo.barcode) {
                status = c.status;
              }
            })
          );
        }
      });
    }

    return (
      <a
        onClick={() => {
          this.props.colloSelected(collo);
        }}
        key={collo.id}
        className={className}
      >
        {collo.barcode}
        {status && (
          <span className={status!.accent.delivery}>{status!.name}</span>
        )}
      </a>
    );
  }

  renderConsigneeInformation(order: Order) {
    return (
      <div className="c-orderDetails-consigneeInfo c-orderDetails-section">
        <div className="font-heading c-orderDetails-headline">
          {Localization.operationsValue("Order_Details_Consignee_Headline")}
        </div>
        {order.consignee.name &&
          this.metaRow(
            Localization.operationsValue("Order_Details_Name"),
            order.consignee.name
          )}
        {order.consignee.location &&
          this.metaRow(
            Localization.operationsValue("Order_Details_Address"),
            order.consignee.location.address.toString()
          )}
        {order.consignee.phone &&
          this.metaRow(
            Localization.operationsValue("Order_Details_PhoneNumber"),
            order.consignee.phone
          )}
        {this.renderTimeInterval(
          Localization.operationsValue(
            "Order_Details_DeliveryInterval_Headline"
          ),
          order.deliveryTimeframe.dateTimeFrom,
          order.deliveryTimeframe.dateTimeTo
        )}
      </div>
    );
  }

  renderConsignorInformation(order: Order) {
    return (
      <div className="c-orderDetails-consignorInfo c-orderDetails-section">
        <div className="font-heading c-orderDetails-headline">
          {Localization.operationsValue("Order_Details_Consignor_Headline")}
        </div>
        {order.consignor.name &&
          this.metaRow(
            Localization.operationsValue("Order_Details_Name"),
            order.consignor.name
          )}
        {order.consignor.location &&
          this.metaRow(
            Localization.operationsValue("Order_Details_Address"),
            order.consignor.location.address.toString()
          )}
        {order.consignor.phone &&
          this.metaRow(
            Localization.operationsValue("Order_Details_PhoneNumber"),
            order.consignor.phone
          )}
        {this.renderTimeInterval(
          Localization.operationsValue("Order_Details_PickupInterval_Headline"),
          order.pickupTimeframe.dateTimeFrom,
          order.pickupTimeframe.dateTimeTo
        )}
      </div>
    );
  }

  renderTimeInterval(
    headline: string,
    from?: moment.Moment,
    to?: moment.Moment
  ) {
    if (from === undefined && to === undefined) {
      return;
    }
    return (
      <div className="c-orderDetails-intervals">
        <div className="font-heading c-orderDetails-headline">{headline}</div>
        {from &&
          this.metaRow(
            Localization.operationsValue("Order_Details_From"),
            from.format(Constants.DATE_TIME_FORMAT)
          )}
        {to &&
          this.metaRow(
            Localization.operationsValue("Order_Details_To"),
            to.format(Constants.DATE_TIME_FORMAT)
          )}
      </div>
    );
  }

  render() {
    return (
      <div className="c-orderDetails-meta user-select-text">
        {this.renderOrderInformations(orderDetailsStore.order!)}
        {this.renderColli(
          orderDetailsStore.order!.actualColli,
          orderDetailsStore.order!.estimatedColli
        )}
        {this.renderConsigneeInformation(orderDetailsStore.order!)}
        {this.renderConsignorInformation(orderDetailsStore.order!)}
      </div>
    );
  }
}
