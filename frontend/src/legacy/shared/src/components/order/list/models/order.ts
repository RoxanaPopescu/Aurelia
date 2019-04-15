import { TimeOfDay } from "shared/src/model/general/timeOfDay";
import { DateTime } from "luxon";
import { Accent } from "shared/src/model/general/accent";
import Localization from "../../../../localization/index";
import { Location } from "shared/src/model/general/location";

export class OrderStatus {
  public static readonly map = {
    all: {
      slug: "all",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:All"),
      accent: "neutral",
      value: 1
    },
    placed: {
      slug: "placed",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Placed"),
      accent: "neutral",
      value: 1
    },
    validated: {
      slug: "validated",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Validated"),
      accent: "neutral",
      value: 2
    },
    ready: {
      slug: "ready",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Ready"),
      accent: "positive",
      value: 3
    },
    deleted: {
      slug: "deleted",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Deleted"),
      accent: "negative",
      value: 4
    },
    cancelled: {
      slug: "cancelled",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Cancelled"),
      accent: "negative",
      value: 5
    },
    inRoutePlanning: {
      slug: "inRoutePlanning",
      name: Localization.sharedValue(
        "Model_Logistics_OrderStatus:InRoutePlanning"
      ),
      accent: "positive",
      value: 6
    },
    delivered: {
      slug: "delivered",
      name: Localization.sharedValue("Model_Logistics_OrderStatus:Delivered"),
      accent: "positive",
      value: 7
    },
    routePlanned: {
      slug: "routePlanned",
      name: Localization.sharedValue(
        "Model_Logistics_OrderStatus:RoutePlanned"
      ),
      accent: "positive",
      value: 8
    }
  };

  public constructor(status: keyof typeof OrderStatus.map) {
    Object.assign(this, OrderStatus.map[status]);
  }

  public slug: keyof typeof OrderStatus.map;
  public name: string;
  public accent: Accent;
  public value: number;
}

export class Order {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.internalId = data.internalId;
    this.publicId = data.publicId;
    this.earliestPickupDate = DateTime.fromISO(data.earliestPickupDate);
    this.earliestPickupTime = TimeOfDay.fromISO(data.earliestPickupTime);
    this.latestPickupDate = DateTime.fromISO(data.latestPickupDate);
    this.latestPickupTime = TimeOfDay.fromISO(data.latestPickupTime);
    this.pickupLocation = new Location({
      address: {
        primary: data.pickupLocation.address,
        secondary: ""
      },
      position: data.pickupLocation.position
    });
    this.deliveryLocation = new Location({
      address: {
        primary: data.deliveryLocation.address,
        secondary: ""
      },
      position: data.deliveryLocation.position
    });
    this.status = new OrderStatus(data.status.name.toLowerCase());
  }

  public internalId: string;

  public publicId: string;

  public earliestPickupDate: DateTime;

  public earliestPickupTime: TimeOfDay;

  public latestPickupDate: DateTime;

  public latestPickupTime: TimeOfDay;

  public deliveryLocation: Location;

  public pickupLocation: Location;

  public status: OrderStatus;
}
