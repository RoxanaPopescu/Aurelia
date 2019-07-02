import Base from "shared/src/services/base";
import Localization from "shared/src/localization";
import { OrderGroup } from "../../../shared/src/model/logistics/orderGroups/orderGroup";
import { TimeOfDay } from "shared/src/model/general/timeOfDay";
import { TimeSlot } from "../components/orderGroup/single/models/timeSlot";
import { Consignor } from "shared/src/model/logistics/consignor";

export default class OrderGroupService {
  static async getOrderGroups() {
    let response = await fetch(
      Base.url("ordergroups/list", {}),
      Base.defaultConfig()
    );

    if (response.ok) {
      let responseJson = await response.json();

      return responseJson.map(orderGroup => new OrderGroup(orderGroup));
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  static async createOrderGroup(
    name: string,
    consignorIds: string[],
    zipCodes: string[],
    tags: string[]
  ) {
    // tslint:disable-next-line:no-any
    let items: { [Key: string]: any } = {
      orderGroupName: name,
      ConsignorIds: consignorIds,
      zipCodes: this.createZipRange(zipCodes),
      tags: tags,
      priority: 1,
      timeZone: "Romance Standard Time"
    };

    let response = await fetch(
      Base.url("ordergroups/create", {}),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      let responseJson = await response.json();

      return responseJson;
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  static async listConsignors(): Promise<Consignor[]> {
    let response = await fetch(
      Base.url("ordergroups/listconsignors", {}),
      Base.defaultConfig()
    );

    if (response.ok) {
      let responseJson = await response.json();

      return responseJson.consignors.map(consignor => new Consignor(consignor));
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  static async addSchedule(
    orderGroupId: string,
    deliveryTimeFrom: TimeOfDay,
    deliveryTimeTo: TimeOfDay,
    deliveryDayOfWeek: number,
    executionTime: TimeOfDay,
    executionDayOfWeek: number
  ) {
    // tslint:disable-next-line:no-any
    let items: { [Key: string]: any } = {
      executionTime: {
        dayOfWeek: executionDayOfWeek,
        timeOfDay: executionTime.seconds
      },
      deliveryTimeRange: {
        from: {
          dayOfWeek: this.getCorrectDayOfWeek(
            deliveryDayOfWeek,
            deliveryTimeFrom,
            deliveryTimeTo
          ).from,
          timeOfDay: deliveryTimeFrom.seconds
        },
        to: {
          dayOfWeek: this.getCorrectDayOfWeek(
            deliveryDayOfWeek,
            deliveryTimeFrom,
            deliveryTimeTo
          ).to,
          timeOfDay: deliveryTimeTo.seconds
        }
      },
      orderGroupId: orderGroupId
    };

    let response = await fetch(
      Base.url("ordergroups/addschedule", {}),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      // let responseJson = await response.json();

      // console.log(responseJson);

      return new TimeSlot(items);
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  private static getCorrectDayOfWeek(
    dayOfWeek: number,
    timeFrom: TimeOfDay,
    timeTo: TimeOfDay
  ) {
    if (timeTo.seconds < timeFrom.seconds) {
      return { from: dayOfWeek, to: dayOfWeek + 1 };
    } else {
      return { from: dayOfWeek, to: dayOfWeek };
    }
  }

  private static createZipRange(zipCodes: string[]) {
    return zipCodes.map(zips => {
      var temp = zips.split("-");
      return {
        from: temp[0],
        to: temp[1] === undefined ? temp[0] : temp[1]
      };
    });
  }
}
