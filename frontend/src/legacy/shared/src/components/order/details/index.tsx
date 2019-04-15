import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { OrderDetailsStore } from "./store";
import OrderDetailsMetaComponent from "./components/orderDetailsMeta";
import H from "history";
import qs from "query-string";
import { Order, Collo } from "shared/src/model/logistics/order";
import ColloDetailsComponent from "./components/colloInformation";
import JourneyInformationComponent from "./components/journeyInformation";
import {
  LoadingInline,
  ErrorInline,
  ButtonType,
  Button,
  Toast,
  ToastType,
  ButtonSize
} from "shared/src/webKit";
import Localization from "../../../localization";
import { SubPage } from "shared/src/utillity/page";
import AssignFulfillerButton from "./components/assignFulfiller/assignFulfiller";
import OrderService from "../service";
import { WorldMap } from "../../worldMap/worldMap";
import { PageHeaderComponent } from "../../pageHeader";

export const orderDetailsStore = new OrderDetailsStore();

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history?: H.History;
  location?: H.Location;
}

@observer
export default class OrderDetailsComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    orderDetailsStore.orderId = props.match.params.id;

    this.fetchOrder();
  }

  private fetchOrder() {
    orderDetailsStore.loading = true;
    orderDetailsStore.error = undefined;
    if (
      orderDetailsStore.order &&
      orderDetailsStore.order.publicOrderId !== orderDetailsStore.orderId
    ) {
      orderDetailsStore.order = undefined;
    }

    OrderService.details(orderDetailsStore.orderId)
      .then(order => {
        orderDetailsStore.order = order;
        orderDetailsStore.loading = false;
        this.getSelectedCollo();
      })
      .catch(error => {
        orderDetailsStore.error = error.message;
        orderDetailsStore.loading = false;
      });
  }

  private cancelOrder() {
    orderDetailsStore.loading = true;
    orderDetailsStore.error = undefined;
    if (
      orderDetailsStore.order &&
      orderDetailsStore.order.publicOrderId !== orderDetailsStore.orderId
    ) {
      orderDetailsStore.order = undefined;
    }

    OrderService.cancel(orderDetailsStore.orderId)
      .then(response => {
        if (response) {
          orderDetailsStore.success = "Ordren er afbestilt.";
          this.fetchOrder();
        } else {
          orderDetailsStore.loading = false;
        }
      })
      .catch(error => {
        orderDetailsStore.error = error.message;
        orderDetailsStore.loading = false;
      });
  }

  private getSelectedCollo() {
    let queries = qs.parse(this.props.location!.search);
    if (orderDetailsStore.order) {
      if (queries.collo) {
        let selectedCollo = orderDetailsStore.order.estimatedColli.filter(
          collo => collo.barcode === queries.collo
        );
        if (selectedCollo !== undefined) {
          selectedCollo = orderDetailsStore.order.actualColli.filter(
            collo => collo.barcode === queries.collo
          );
        }
        if (selectedCollo !== undefined) {
          orderDetailsStore.selectedCollo = selectedCollo[0];
        }
      } else {
        if (orderDetailsStore.order.estimatedColli.length > 0) {
          this.props.history!.push(
            this.props.location!.pathname +
              "?collo=" +
              orderDetailsStore.order.estimatedColli[0].barcode
          );
        }
      }
    }
  }

  private setSelectedCollo(collo: Collo) {
    orderDetailsStore.selectedCollo = collo;
    this.props.history!.push(
      this.props.location!.pathname + "?collo=" + collo.barcode
    );
  }

  private renderActionBar() {
    return (
      <PageHeaderComponent
        history={this.props.history}
        path={[
          { title: "Ordrer", href: SubPage.path(SubPage.OrderList) },
          { title: orderDetailsStore.order!.publicOrderId }
        ]}
      >

        {orderDetailsStore.order!.state.canBeEdited && (
          <Button
            onClick={() => {
              this.props.history!.push(
                SubPage.path(SubPage.OrderUpdate).replace(
                  ":id",
                  orderDetailsStore.orderId
                )
              );
            }}
            type={ButtonType.Light}
            size={ButtonSize.Medium}
            loading={orderDetailsStore.loading}
          >
            Rediger ordre
          </Button>
        )}

        <AssignFulfillerButton order={orderDetailsStore.order!} />
        
        {orderDetailsStore.order!.state.canBeCancelled && (
          <Button
            onClick={() => {
              this.cancelOrder();
            }}
            type={ButtonType.Light}
            size={ButtonSize.Medium}
            loading={orderDetailsStore.loading}
          >
            {Localization.sharedValue("Trip_CancelButton")}
          </Button>
        )}

      </PageHeaderComponent>
    );
  }

  private getSelectedColli(order: Order) {
    return orderDetailsStore.selectedCollo
      ? orderDetailsStore.selectedCollo
      : order.actualColli.length > 0
        ? order.actualColli[0]
        : order.estimatedColli[0];
  }

  render() {
    document.title = Localization.operationsValue("Order_OrderDetails_Title", {
      id: orderDetailsStore.orderId
    });
    if (orderDetailsStore.order !== undefined) {
      return (
        <div className="c-order">
          <div className="c-order-innerWrapper">
            <OrderDetailsMetaComponent
              colloSelected={collo => {
                this.setSelectedCollo(collo);
              }}
              selectedCollo={this.getSelectedColli(orderDetailsStore.order)}
            />
            <div className="c-order-content">
              {this.renderActionBar()}
              <ColloDetailsComponent
                selectedCollo={this.getSelectedColli(orderDetailsStore.order)}
              />
              <div className="c-orderDetails-map">
                <WorldMap onMapReady={map => (orderDetailsStore.map = map)}>
                  {orderDetailsStore.markers}
                  {orderDetailsStore.polylines}
                </WorldMap>
              </div>
              {orderDetailsStore.orderId !== undefined && (
                <JourneyInformationComponent />
              )}
            </div>
          </div>
          {orderDetailsStore.error && (
            <Toast
              remove={() => (orderDetailsStore.error = undefined)}
              type={ToastType.Alert}
            >
              {orderDetailsStore.error}
            </Toast>
          )}
          {orderDetailsStore.success && (
            <Toast
              remove={() => (orderDetailsStore.success = undefined)}
              type={ToastType.Success}
            >
              {orderDetailsStore.success}
            </Toast>
          )}
        </div>
      );
    } else {
      if (orderDetailsStore.loading) {
        return (
          <LoadingInline/>
        );
      } else if (orderDetailsStore.error !== undefined) {
        return (
          <ErrorInline description={orderDetailsStore.error}>
            <Button onClick={() => this.fetchOrder()} type={ButtonType.Action}>
              {Localization.sharedValue("Retry")}
            </Button>
          </ErrorInline>
        );
      } else {
        return (
          <ErrorInline description={Localization.sharedValue("Error_General")}>
            <Button onClick={() => this.fetchOrder()} type={ButtonType.Action}>
              {Localization.sharedValue("Retry")}
            </Button>
          </ErrorInline>
        );
      }
    }
  }
}
