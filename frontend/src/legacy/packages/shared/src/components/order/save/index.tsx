import React from "react";
import "./styles.scss";
import {
  SaveOrderStore,
  SaveOrder,
  SaveOrderType,
  SaveOrderTemplate
} from "./store";
import {
  ContentBox,
  Button,
  ButtonType,
  Input,
  InputNumbers,
  InputPhone,
  DateTimeComponent,
  Toast,
  ToastType,
  ButtonSize
} from "shared/src/webKit";
import H from "history";
import { observer } from "mobx-react";
import Localization from "../../../localization";
import AddressSearchComponent from "../../addressSearch";
import OrderService from "../service";
import { SubPage } from "../../../utillity/page";
import { Link } from "react-router-dom";
import Select from "../../../webKit/select/index";
import { Session } from "../../../model/session/session";
import { Fulfiller } from "../../../model/logistics/fulfiller";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history?: H.History;
}

@observer
export default class SaveOrderComponent extends React.Component<Props> {
  saveOrdersStore: SaveOrderStore;

  constructor(props: Props) {
    super(props);
    this.saveOrdersStore = new SaveOrderStore();
  }

  componentDidMount() {
    if (Session.outfit instanceof Fulfiller) {
      this.fetchConsignors();

      if (this.props.match.params.id === undefined) {
        // When placing an order
        this.saveOrdersStore.generalOrderTemplate = [
          { required: true, type: SaveOrderType.ConsignorId },
          { required: false, type: SaveOrderType.PickupAddress },
          { required: false, type: SaveOrderType.ContactPerson },
          { required: false, type: SaveOrderType.CompanyName },
          { required: false, type: SaveOrderType.Instructions }
        ];

        this.saveOrdersStore.orderTemplate = [
          { required: true, type: SaveOrderType.ConsignorOrderId },
          { required: true, type: SaveOrderType.PickupAddress },
          { required: true, type: SaveOrderType.DeliveryAddress },
          { required: false, type: SaveOrderType.PickupDateTime },
          { required: false, type: SaveOrderType.DeliveryDateTime },
          { required: false, type: SaveOrderType.CompanyName },
          { required: true, type: SaveOrderType.ContactPerson },
          { required: false, type: SaveOrderType.Instructions },
          { required: true, type: SaveOrderType.ColliCount }
        ];
      } else {
        // When editing an existing order
        this.saveOrdersStore.orderTemplate = [
          { required: true, type: SaveOrderType.ConsignorId },
          { required: true, type: SaveOrderType.ConsignorOrderId },
          { required: true, type: SaveOrderType.PickupAddress },
          { required: true, type: SaveOrderType.DeliveryAddress },
          { required: false, type: SaveOrderType.PickupDateTime },
          { required: false, type: SaveOrderType.DeliveryDateTime },
          { required: false, type: SaveOrderType.CompanyName },
          { required: true, type: SaveOrderType.ContactPerson },
          { required: false, type: SaveOrderType.Instructions },
          { required: true, type: SaveOrderType.ColliCount }
        ];
      }
    }

    if (this.props.match.params.id !== this.saveOrdersStore.orderId) {
      this.saveOrdersStore.clear();
    }

    this.saveOrdersStore.orderId = this.props.match.params.id;

    if (this.props.match.params.id) {
      this.getOrder();
    }
  }

  renderOrderContent(
    order: SaveOrder,
    index: number,
    templates: SaveOrderTemplate[],
    validate: boolean = true
  ) {
    let components: JSX.Element[] = [];

    templates.map(template => {
      if (
        template.type === SaveOrderType.ColliWeightSize ||
        template.type === SaveOrderType.ColliBarcode
      ) {
        return;
      }

      let inputComponents: JSX.Element[] = [];

      // tslint:disable-next-line:switch-default
      switch (template.type) {
        case SaveOrderType.ConsignorId:
          inputComponents.push(
            <div
              key={index + "-order-consignor"}
              className="c-order-create-grid-content-input"
            >
              <Select
                headline="Afsender"
                size="medium"
                options={
                  this.saveOrdersStore.consignors
                    ? this.saveOrdersStore.consignors.map(c => ({
                        label: c.companyName!,
                        value: c.id
                      }))
                    : []
                }
                readonly={this.saveOrdersStore.loading}
                value={order.consignorId}
                error={
                  validate &&
                  this.saveOrdersStore.didTryToOrder &&
                  order.consignorId === undefined
                }
                onSelect={option => {
                  if (option) {
                    order.consignorId = option.value;
                  }
                }}
              />
            </div>
          );
          break;
        case SaveOrderType.ConsignorOrderId:
          inputComponents.push(
            <Input
              key={index + "-order-number"}
              headline={SaveOrderType.title(template.type)}
              error={
                validate &&
                this.saveOrdersStore.didTryToOrder &&
                order.publicOrderId === undefined
              }
              disabled={this.saveOrdersStore.loading}
              value={order.publicOrderId}
              placeholder={Localization.consignorValue(
                "Order_Create_Placeholder_Number"
              )}
              size={"medium"}
              className="c-order-create-grid-content-input"
              onChange={value => (order.publicOrderId = value)}
            />
          );
          break;
        case SaveOrderType.PickupAddress:
          inputComponents.push(
            <div
              key={index + "-order-pickup-address"}
              className="c-order-create-grid-content-input"
            >
              <AddressSearchComponent
                error={
                  validate &&
                  this.saveOrdersStore.didTryToOrder &&
                  (order.pickupAddress === undefined &&
                    this.saveOrdersStore.generalOrder.pickupAddress ===
                      undefined)
                }
                disabled={this.saveOrdersStore.loading}
                value={order.pickupAddress}
                headline={SaveOrderType.title(template.type)}
                key={index + "-order-pickupAddress"}
                placeholder={
                  this.saveOrdersStore.generalOrder.pickupAddress
                    ? this.saveOrdersStore.generalOrder.pickupAddress.formattedString()
                    : Localization.consignorValue(
                        "Order_Create_Placeholder_PickupAddress"
                      )
                }
                onChange={location => {
                  order.pickupAddress = location ? location.address : undefined;
                }}
              />
            </div>
          );
          break;
        case SaveOrderType.DeliveryAddress:
          inputComponents.push(
            <div
              key={index + "-order-delivery-address"}
              className="c-order-create-grid-content-input"
            >
              <AddressSearchComponent
                error={
                  validate &&
                  this.saveOrdersStore.didTryToOrder &&
                  order.deliveryAddress === undefined
                }
                disabled={this.saveOrdersStore.loading}
                value={order.deliveryAddress}
                headline={SaveOrderType.title(template.type)}
                key={index + "-order-deliveryAddress"}
                placeholder={Localization.consignorValue(
                  "Order_Create_Placeholder_DeliveryAddress"
                )}
                onChange={location => {
                  order.deliveryAddress = location
                    ? location.address
                    : undefined;
                }}
              />
            </div>
          );
          break;
        case SaveOrderType.ColliCount:
          inputComponents.push(
            <InputNumbers
              key={index + "-order-colli-count"}
              headline={SaveOrderType.title(template.type)}
              error={
                validate &&
                this.saveOrdersStore.didTryToOrder &&
                order.colliCount === undefined
              }
              disabled={this.saveOrdersStore.loading}
              size={"medium"}
              value={order.colliCount}
              className="c-order-create-grid-content-inputSmall"
              onChange={value => {
                order.colliCount = value ? Number(value) : undefined;
              }}
            />
          );
          break;
        case SaveOrderType.CompanyName:
          inputComponents.push(
            <Input
              key={index + "-order-companyName"}
              headline={SaveOrderType.title(template.type)}
              error={
                validate &&
                this.saveOrdersStore.didTryToOrder &&
                template.required &&
                (order.companyName === undefined &&
                  this.saveOrdersStore.generalOrder.companyName === undefined)
              }
              disabled={this.saveOrdersStore.loading}
              size={"medium"}
              value={order.companyName}
              placeholder={
                this.saveOrdersStore.generalOrder.companyName
                  ? this.saveOrdersStore.generalOrder.companyName
                  : Localization.consignorValue(
                      "Order_Create_Placeholder_CompanyName"
                    )
              }
              className="c-order-create-grid-content-input"
              onChange={value => (order.companyName = value)}
            />
          );
          break;
        case SaveOrderType.ContactPerson:
          inputComponents.push(
            <Input
              key={index + "-order-contactPerson-name"}
              headline="Kontaktperson"
              error={
                validate &&
                this.saveOrdersStore.didTryToOrder &&
                template.required &&
                (order.contactPerson.name === undefined &&
                  this.saveOrdersStore.generalOrder.contactPerson.name ===
                    undefined)
              }
              disabled={this.saveOrdersStore.loading}
              size={"medium"}
              value={order.contactPerson.name}
              placeholder={
                this.saveOrdersStore.generalOrder.contactPerson.name
                  ? this.saveOrdersStore.generalOrder.contactPerson.name
                  : Localization.consignorValue(
                      "Order_Create_Placeholder_ContactPersonName"
                    )
              }
              className="c-order-create-grid-content-inputHalf"
              onChange={value => (order.contactPerson.name = value)}
            />
          );
          inputComponents.push(
            <InputPhone
              key={index + "-order-contactPerson-phone"}
              headline="Telefonnummer"
              error={
                (validate &&
                  this.saveOrdersStore.didTryToOrder &&
                  template.required &&
                  order.contactPerson.phone === undefined &&
                  this.saveOrdersStore.generalOrder.contactPerson.phone ===
                    undefined) ||
                (order.contactPerson.phone !== undefined &&
                  order.contactPerson.phone.length !== 8)
              }
              disabled={this.saveOrdersStore.loading}
              size={"medium"}
              value={order.contactPerson.phone}
              maxlength={8}
              minlength={8}
              placeholder={
                this.saveOrdersStore.generalOrder.contactPerson.phone
                  ? this.saveOrdersStore.generalOrder.contactPerson.phone
                  : Localization.consignorValue(
                      "Order_Create_Placeholder_ContactPersonPhone"
                    )
              }
              className="c-order-create-grid-content-inputHalf"
              onChange={value => (order.contactPerson.phone = value)}
            />
          );
          break;
        case SaveOrderType.Instructions:
          inputComponents.push(
            <Input
              key={index + "-order-instructions"}
              headline={SaveOrderType.title(template.type)}
              error={
                validate &&
                this.saveOrdersStore.didTryToOrder &&
                template.required &&
                (order.instructions === undefined &&
                  this.saveOrdersStore.generalOrder.instructions === undefined)
              }
              disabled={this.saveOrdersStore.loading}
              size={"medium"}
              value={order.instructions}
              placeholder={
                this.saveOrdersStore.generalOrder.instructions
                  ? this.saveOrdersStore.generalOrder.instructions
                  : Localization.consignorValue(
                      "Order_Create_Placeholder_Instructions"
                    )
              }
              className="c-order-create-grid-content-input"
              onChange={value => (order.instructions = value)}
            />
          );
          break;
        case SaveOrderType.DeliveryDateTime:
          inputComponents.push(
            <DateTimeComponent
              key={index + SaveOrderType.PickupDateTime}
              className="c-order-create-grid-content-input"
              disabled={this.saveOrdersStore.loading}
              value={order.deliveryDate}
              placeholders={{
                date: Localization.sharedValue("General_Inbetween"),
                time: Localization.sharedValue("Order_TimeFrame_TimeFrom")
              }}
              headline={Localization.consignorValue(
                "Order_Create_TimerRange_DeliveryTitle"
              )}
              size={"medium"}
              onChange={date => {
                order.deliveryDate = date;
              }}
            />
          );
          break;
        case SaveOrderType.PickupDateTime:
          inputComponents.push(
            <DateTimeComponent
              key={index + SaveOrderType.PickupDateTime}
              className="c-order-create-grid-content-input"
              disabled={this.saveOrdersStore.loading}
              value={order.pickupDate}
              placeholders={{
                date: Localization.sharedValue("General_Inbetween"),
                time: Localization.sharedValue("Order_TimeFrame_TimeFrom")
              }}
              headline={Localization.consignorValue(
                "Order_Create_TimerRange_PickupTitle"
              )}
              size={"medium"}
              onChange={date => {
                order.pickupDate = date;
              }}
            />
          );
          break;
      }

      components.push(
        <div
          key={template.type + "-content-order"}
          className="c-order-create-grid-content"
        >
          {inputComponents}
        </div>
      );
    });

    return components;
  }

  getOrderHeadline(order: SaveOrder, index: number) {
    if (this.saveOrdersStore.orderId === undefined) {
      if (order.publicOrderId) {
        return `#${order.publicOrderId}`;
      } else {
        return Localization.consignorValue("Order_Create_OrderCount").replace(
          "{number}",
          "" + (index + 1)
        );
      }
    } else {
      if (this.saveOrdersStore.orderDetails !== undefined) {
        return Localization.consignorValue("Order_Create_OrderCount").replace("{order-id}", order.publicOrderId!);
      } else {
        return Localization.sharedValue("General_Loading");
      }
    }
  }

  renderOrders() {
    return this.saveOrdersStore.orders.map((order, index) => (
      <div
        key={`Order-number-${index}`}
        className={`c-order-create-outerOrder${
          this.saveOrdersStore.activeOrderIndex === index ? " open" : ""
        }`}
      >
        <div
          onClick={() => {
            if (this.saveOrdersStore.activeOrderIndex === index) {
              this.saveOrdersStore.activeOrderIndex = -2;
            } else {
              this.saveOrdersStore.activeOrderIndex = index;
            }
          }}
          className="c-order-create-orderHead"
        >
          {this.getOrderHeadline(order, index)}
          {this.saveOrdersStore.orders.length > 1 && (
            <div
              onClick={() => this.saveOrdersStore.remove(order)}
              className="c-order-create-remove"
            />
          )}
          <div className="c-order-create-chevron" />
        </div>
        {this.saveOrdersStore.activeOrderIndex === index && (
          <div className="c-order-create-grid">
            {this.renderOrderContent(
              order,
              index,
              this.saveOrdersStore.orderTemplate
            )}
          </div>
        )}
      </div>
    ));
  }

  render() {
    return (
      <>

        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: Localization.sharedValue("General_Orders"), href: SubPage.path(SubPage.OrderList) },
            { title: !this.saveOrdersStore.orderDetails && !this.saveOrdersStore.orderId ? Localization.sharedValue("Order_New") : Localization.sharedValue("Order_Edit") }
          ]}
          actionElements={<>
            {!this.saveOrdersStore.orderDetails && !this.saveOrdersStore.orderId &&
            <Button
              onClick={() => this.saveOrdersStore.addOrder()}
              type={ButtonType.Light}
              size={ButtonSize.Medium}
              disabled={this.saveOrdersStore.loading}
            >
              {Localization.consignorValue(
                "Order_Create_AddAdditional_Button"
              )}
            </Button>}

            {(this.saveOrdersStore.orderDetails === undefined || this.saveOrdersStore.orderId === undefined) &&
            <Button
              onClick={() => this.saveOrdersStore.clear()}
              size={ButtonSize.Medium}
              type={ButtonType.Light}
              loading={this.saveOrdersStore.loading}
              disabled={
                this.saveOrdersStore.loading || this.saveOrdersStore.empty
              }
            >
              {Localization.consignorValue("Order_Create_Actions_ClearOrders_Button")}
            </Button>}

            <div className="pageHeader-actions-separator"/>

            {!this.saveOrdersStore.orderDetails && !this.saveOrdersStore.orderId &&
            <Button
              onClick={() => this.placeOrder()}
              size={ButtonSize.Medium}
              type={ButtonType.Action}
              disabled={
                this.saveOrdersStore.loading ||
                this.saveOrdersStore.empty
              }
              className="c-order-create-summary-order"
            >
              {Localization.consignorValue(
                "Order_Create_Complete_Button"
              )}
            </Button>}

            {this.saveOrdersStore.orderDetails && this.saveOrdersStore.orderId &&
              <Button
                size={ButtonSize.Medium}
                type={ButtonType.Action}
                loading={this.saveOrdersStore.loading}
                onClick={() => this.editOrder()}
              >
                {Localization.consignorValue(
                  "Order_Create_Update_Button"
                )}
              </Button>
            }
          </>}
        >

        </PageHeaderComponent>

        <PageContentComponent>

          <div className="c-order-create-container">
              {this.saveOrdersStore.generalOrderTemplate.length > 0 &&
                this.saveOrdersStore.orderId === undefined && (
                  <div
                    className={`c-order-create-outerOrder${
                      this.saveOrdersStore.generalInformationOpen ? " open" : ""
                    }`}
                  >
                    <div
                      className="c-order-create-orderHead"
                      onClick={() => {
                        this.saveOrdersStore.generalInformationOpen = !this
                          .saveOrdersStore.generalInformationOpen;
                      }}
                    >
                      {
                        Localization.consignorValue(
                          "Order_Create_General_Information"
                        )
                      }
                      <div className="c-order-create-chevron" />
                    </div>
                    {this.saveOrdersStore.generalInformationOpen && (
                      <div className="c-order-create-grid">
                        {this.renderOrderContent(
                          this.saveOrdersStore.generalOrder,
                          -1,
                          this.saveOrdersStore.generalOrderTemplate,
                          false
                        )}
                      </div>
                    )}
                  </div>
                )}
              {this.renderOrders()}
              {this.saveOrdersStore.orderId === undefined && (
                <>
                  <div className="c-order-create-summary-outer">
                    <div className="c-order-create-summary">
                      <ContentBox
                        title={Localization.consignorValue(
                          "Order_Create_Summary_Title"
                        )}
                        className="c-order-create-summary-box"
                      >
                        <div className="c-order-create-grid-summary">
                          {this.saveOrdersStore.generalOrder.deliveryDate && (
                            <React.Fragment>
                              <div>
                                {Localization.consignorValue(
                                  "Order_Create_Summary_DeliverDate_Title"
                                )}
                              </div>
                              <div className="font-small c-order-create-grid-summary-content">
                                {Localization.formatDate(
                                  this.saveOrdersStore.generalOrder.deliveryDate
                                )}
                              </div>
                            </React.Fragment>
                          )}
                          <div>
                            {Localization.consignorValue(
                              "Order_Create_Summary_OrderCount_Title"
                            )}
                          </div>
                          <div className="font-small c-order-create-grid-summary-content">
                            {Localization.consignorValue(
                              "Order_Create_Summary_OrderCount"
                            ).replace(
                              "{count}",
                              "" + this.saveOrdersStore.orderCount
                            )}
                          </div>
                          <div>
                            {Localization.consignorValue(
                              "Order_Create_Summary_ColliCount_Title"
                            )}
                          </div>
                          <div className="font-small c-order-create-grid-summary-content">
                            {this.saveOrdersStore.colliCount}
                          </div>
                        </div>
                      </ContentBox>
                    </div>
                  </div>
                </>
              )}
            </div>

        </PageContentComponent>

        {this.saveOrdersStore.error && (
          <Toast
            type={ToastType.Alert}
            remove={() => (this.saveOrdersStore.error = undefined)}
          >
            {this.saveOrdersStore.error}
          </Toast>
        )}
        {this.saveOrdersStore.showSuccess && (
          <Toast
            type={ToastType.Success}
            remove={() => (this.saveOrdersStore.showSuccess = false)}
          >
            <>
              Ordren er blevet oprettet.{" "}
              <Link to={SubPage.path(SubPage.OrderList)}>Se alle ordrer.</Link>
            </>
          </Toast>
        )}

      </>
    );
  }

  private placeOrder() {
    this.saveOrdersStore.didTryToOrder = true;
    if (this.saveOrdersStore.validOrder() === false) {
      return;
    }

    this.saveOrdersStore.loading = true;
    this.saveOrdersStore.error = undefined;
    this.saveOrdersStore.showSuccess = false;

    OrderService.place(
      this.saveOrdersStore.generalOrder,
      this.saveOrdersStore.orders
    )
      .then(() => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.clear();
        this.saveOrdersStore.showSuccess = true;
      })
      .catch(error => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.error = error.message;
      });
  }

  private editOrder() {
    this.saveOrdersStore.didTryToOrder = true;
    if (this.saveOrdersStore.validOrder(false) === false) {
      return;
    }

    this.saveOrdersStore.loading = true;
    this.saveOrdersStore.error = undefined;
    this.saveOrdersStore.showSuccess = false;

    OrderService.update(this.saveOrdersStore.orders[0])
      .then(() => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.didTryToOrder = false;
        this.saveOrdersStore.showSuccess = true;
      })
      .catch(error => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.didTryToOrder = false;
        this.saveOrdersStore.error = error.message;
      });
  }

  private getOrder() {
    this.saveOrdersStore.loading = true;
    this.saveOrdersStore.error = undefined;
    this.saveOrdersStore.showSuccess = false;

    OrderService.details(this.saveOrdersStore.orderId!)
      .then(order => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.orderDetails = order;
        this.saveOrdersStore.orders = [new SaveOrder(order)];
      })
      .catch(error => {
        this.saveOrdersStore.loading = false;
        this.saveOrdersStore.error = error.message;
      });
  }

  private fetchConsignors() {
    // TODO: If we re-enable add order
    /*
    OrderGroupService.listConsignors()
      .then(consignors => {
        this.saveOrdersStore.consignors = consignors;
      })
      .catch(error => {
        this.saveOrdersStore.error = error.message;
      });
      */
  }
}
