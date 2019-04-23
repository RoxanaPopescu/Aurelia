import { GUID } from "shared/src/webKit";
import Cookies from "universal-cookie";
import { observable, computed } from "mobx";
import Localization from "../../../localization";
import { DateTime } from "luxon";
import { Address } from "shared/src/model/general/address";
import { Order } from "shared/src/model/logistics/order";
import { Outfit } from "../../../model/logistics/outfit";

const cookies = new Cookies();

export class SaveOrderTemplate {
  @observable required: boolean;
  @observable type: SaveOrderType;
}

export class SaveOrderStore {
  @observable orderId?: string;
  @observable consignors?: Outfit[];
  @observable loading: boolean = false;
  @observable validate: boolean = false;
  @observable error?: string;
  // tslint:disable-next-line:no-any
  @observable showSuccess = false;
  generalOrder: SaveOrder = new SaveOrder();
  @observable orders: SaveOrder[] = [new SaveOrder()];
  @observable orderDetails?: Order;
  @observable activeOrderIndex: number = 0;
  @observable generalInformationOpen: boolean = true;
  @observable didTryToOrder = false;

  @observable
  generalOrderTemplate: SaveOrderTemplate[] = [
    { required: false, type: SaveOrderType.PickupAddress },
    { required: false, type: SaveOrderType.ContactPerson },
    { required: false, type: SaveOrderType.CompanyName },
    { required: false, type: SaveOrderType.Instructions }
  ];

  @observable orderTemplate: SaveOrderTemplate[];

  @computed
  get orderCount(): number {
    return this.orders.length;
  }

  @computed
  get empty(): boolean {
    if (this.orders.length > 1) {
      return false;
    }

    if (this.generalOrder.empty === false) {
      return false;
    }

    for (let order of this.orders) {
      if (order.empty === false) {
        return false;
      }
    }

    return true;
  }

  @computed
  get colliCount(): number {
    return this.orders.reduce(
      (previousValue: number, currentValue: SaveOrder): number => {
        if (currentValue.colliCount) {
          previousValue += currentValue.colliCount;
        }
        return previousValue;
      },
      0
    );
  }

  constructor() {
    let settings = cookies.get("order-settings");
    if (settings) {
      this.orderTemplate = settings;
    } else {
      this.orderTemplate = [
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

  saveSettings(template: SaveOrderTemplate[]) {
    let data = JSON.stringify(template);

    cookies.set("order-settings", data, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
    });
  }

  addRemoveTemplate(type: SaveOrderType, general: Boolean = false) {
    let data: SaveOrderTemplate[];
    let required: boolean;

    // FIXME: Make required dependent on setup.........
    if (general) {
      data = this.generalOrderTemplate;
      required = false;
    } else {
      data = this.orderTemplate;
      required = false;
    }

    let existsIndex: number | undefined;
    for (let i = 0; i < data.length; i++) {
      let object = data[i];
      if (object.type === type) {
        existsIndex = i;
        break;
      }
    }

    if (general) {
      if (existsIndex !== undefined) {
        this.generalOrderTemplate.splice(existsIndex, 1);
      } else {
        this.generalOrderTemplate.push({ required: required, type: type });
      }
    } else {
      if (existsIndex !== undefined) {
        this.orderTemplate.splice(existsIndex, 1);
      } else {
        this.orderTemplate.push({ required: required, type: type });
      }
    }
  }

  existInTemplate(type: SaveOrderType, general: Boolean = false): boolean {
    let data: SaveOrderTemplate[];

    if (general) {
      data = this.generalOrderTemplate;
    } else {
      data = this.orderTemplate;
    }

    for (let i = 0; i < data.length; i++) {
      let object = data[i];
      if (object.type === type) {
        return true;
      }
    }

    return false;
  }

  clear() {
    this.generalOrder = new SaveOrder();
    this.orderDetails = undefined;
    this.orders = [new SaveOrder()];
    this.didTryToOrder = false;
    this.showSuccess = false;
    this.error = undefined;
    this.loading = false;
  }

  remove(order: SaveOrder) {
    var index = this.orders.indexOf(order, 0);
    if (index > -1) {
      this.orders.splice(index, 1);
    }
  }

  addOrder() {
    this.orders.push(new SaveOrder());
  }

  validOrder(edit?: boolean): boolean {
    for (let order of this.orders) {
      if (
        this.validateOrder(order, this.orderTemplate, this.generalOrder) ===
        false
      ) {
        return false;
      }
    }

    return true;
  }

  validateForm(order: SaveOrder, type: SaveOrderType) {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case SaveOrderType.ConsignorId:
        if (!order.consignorId) {
          return false;
        }
        break;
      case SaveOrderType.DeliveryAddress:
        if (!order.deliveryAddress) {
          return false;
        }
        break;
      case SaveOrderType.ColliCount:
        if (!order.colliCount || order.colliCount < 1) {
          return false;
        }
        break;
      case SaveOrderType.CompanyName:
        if (!order.companyName) {
          return false;
        }
        break;
      case SaveOrderType.ContactPerson:
        let phone = order.contactPerson.phone;
        if (!order.contactPerson.name || !phone || phone.length !== 8) {
          return false;
        }
        break;
      case SaveOrderType.Instructions:
        if (!order.instructions) {
          return false;
        }
        break;
    }

    return true;
  }

  private validateOrder(
    order: SaveOrder,
    template: SaveOrderTemplate[],
    generalOrder?: SaveOrder
  ): boolean {
    for (let item of template) {
      if (item.required) {
        if (this.validateForm(order, item.type) === false) {
          if (
            generalOrder &&
            this.validateForm(generalOrder, item.type) === false
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

export class SaveOrderContactPerson {
  @observable name?: string;
  @observable phone?: string;
}

export class SaveOrder {
  @observable pickupDate: DateTime = DateTime.local().plus({ minutes: 30 });
  @observable deliveryDate: DateTime = DateTime.local().plus({ minutes: 60 });

  @observable consignorId?: string;
  @observable publicOrderId?: string;
  @observable pickupAddress?: Address;
  @observable deliveryAddress?: Address;
  @observable colliCount?: number;

  @observable
  contactPerson: SaveOrderContactPerson = new SaveOrderContactPerson();
  @observable companyName?: string;
  @observable instructions?: string;
  @observable internalReference?: string;

  constructor(order?: Order) {
    if (order) {
      if (order.pickupTimeframe.dateTimeFrom) {
        this.pickupDate = DateTime.fromISO(
          order.pickupTimeframe.dateTimeFrom.toJSON()
        );
      }
      if (order.deliveryTimeframe.dateTimeFrom) {
        this.deliveryDate = DateTime.fromISO(
          order.deliveryTimeframe.dateTimeFrom.toJSON()
        );
      }
      this.consignorId = order.consignor.id;
      this.publicOrderId = order.publicOrderId;
      this.pickupAddress = order.consignor.location.address;
      this.deliveryAddress = order.consignee.location.address;
      this.colliCount = order.estimatedColli.length;
      this.companyName = order.consignee.companyName;
      this.contactPerson = {
        name: order.consignee.name,
        phone: order.consignee.phone
      };
      this.instructions = order.deliveryInstructions;
      this.internalReference = order.internalOrderId;
    }
  }

  @computed
  get empty(): boolean {
    if (
      this.pickupDate ||
      this.deliveryDate ||
      this.publicOrderId ||
      this.pickupAddress ||
      this.deliveryAddress ||
      this.colliCount ||
      this.contactPerson.phone ||
      this.contactPerson.name ||
      this.companyName ||
      this.instructions ||
      this.internalReference
    ) {
      return false;
    }

    return true;
  }

  toJson(): { [Key: string]: {} } {
    let json: { [Key: string]: {} } = {};

    json.internalOrderId = this.internalReference
      ? this.internalReference
      : GUID.generate();

    if (this.publicOrderId) {
      json.consignorOrderId = this.publicOrderId;
    }
    if (this.pickupAddress) {
      json.pickupAddress = this.pickupAddress.toString();
    }
    if (this.deliveryAddress) {
      json.deliveryAddress = this.deliveryAddress.toString();
    }
    if (this.deliveryDate) {
      json.deliveryDate = this.deliveryDate.toJSON();
    }
    if (this.pickupDate) {
      json.pickupDate = this.pickupDate.toJSON();
    }
    if (this.contactPerson.name) {
      json.contactPerson = this.contactPerson.name;
    }
    if (this.contactPerson.phone) {
      json.contactPhone = this.contactPerson.phone;
    }
    if (this.companyName) {
      json.companyName = this.companyName;
    }
    if (this.instructions) {
      json.instructions = this.instructions;
    }
    if (this.colliCount) {
      json.colliCount = this.colliCount;
    }
    return json;
  }
}

export enum SaveOrderType {
  ConsignorId,
  ConsignorOrderId,
  PickupAddress,
  DeliveryAddress,
  ColliCount,
  ColliBarcode,
  ColliWeightSize,
  CompanyName,
  ContactPerson,
  Instructions,
  PickupDateTime,
  DeliveryDateTime
}

export namespace SaveOrderType {
  export function title(status: SaveOrderType): string | undefined {
    // tslint:disable-next-line:switch-default
    switch (status) {
      case SaveOrderType.ConsignorOrderId:
        return Localization.consignorValue("Order_Input_Number");
      case SaveOrderType.PickupAddress:
        return Localization.consignorValue("Order_Input_PickupAddress");
      case SaveOrderType.DeliveryAddress:
        return Localization.consignorValue("Order_Input_DeliveryAddress");
      case SaveOrderType.ColliCount:
        return Localization.consignorValue("Order_Input_ColliCount");
      case SaveOrderType.CompanyName:
        return Localization.consignorValue("Order_Input_CompanyName");
      case SaveOrderType.ContactPerson:
        return Localization.consignorValue("Order_Input_ContactPerson");
      case SaveOrderType.Instructions:
        return Localization.consignorValue("Order_Input_Instructions");
      case SaveOrderType.PickupDateTime:
        return Localization.consignorValue("Order_Input_PickupInterval");
      case SaveOrderType.DeliveryDateTime:
        return Localization.consignorValue("Order_Input_DeliveryInterval");
    }

    return undefined;
  }
}
