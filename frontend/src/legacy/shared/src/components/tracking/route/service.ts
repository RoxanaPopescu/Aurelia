import Localization from "shared/src/localization";
import { Base } from "../../../webKit/utillity/base";

export default class DriverLocationHistoryServices {
  static async driverLocationHistory(
    driverId: string,
    fromDate: string,
    toDate?: string,
    onlySampling: boolean = false
  ) {
    try {
      // tslint:disable-next-line:no-any
      var items: { [Key: string]: any } = {
        driverId: driverId,
        fromDate: fromDate,
        onlySampling: onlySampling,
        apikey: "moverappaccessios-v5yNBnDFUKkcH89V"
      };

      if (toDate) {
        items.toDate = toDate;
      }

      let response = await fetch(
        DriverLocationHistoryServices.url(
          "gps-locations/get-driver-locations",
          items
        ),
        DriverLocationHistoryServices.defaultConfig()
      );

      let responseJson = await response.json();
      if (response.ok) {
        return responseJson.data;
      } else {
        if (responseJson.status === 401) {
          throw new Error(responseJson.message);
        } else if (responseJson.status === 422) {
          throw new Error(responseJson.message);
        } else if (responseJson.status === 500) {
          throw new Error(responseJson.message);
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private static headers(formData: Boolean = false) {
    var headers = new Headers({
      Accept: "application/json"
    });

    if (formData === false) {
      headers.set("Content-Type", "application/json");
    }

    if (Base.isProduction) {
      headers.set("token", "6439fa4026384d30869b58af335c17e2");
    } else {
      headers.set("token", "83f266be959c40d0ae1d09bbb0dc51d5");
    }

    return headers;
  }

  private static defaultConfig(body?: {}): { [Key: string]: {} } {
    var config;

    if (body) {
      config = {
        method: "POST",
        headers: DriverLocationHistoryServices.headers(),
        body: JSON.stringify(body)
      };
    } else {
      config = {
        method: "GET",
        headers: DriverLocationHistoryServices.headers()
      };
    }

    return config;
  }

  private static url(name: string, items: { [Key: string]: string }): string {
    var base = DriverLocationHistoryServices.baseURL() + name;

    let index = 0;
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        if (index === 0) {
          base = base + "?" + key + "=" + "" + encodeURIComponent(items[key]);
        } else {
          base = base + "&" + key + "=" + "" + encodeURIComponent(items[key]);
        }
        index++;
      }
    }

    return base;
  }

  private static baseURL(): string {
    if (Base.isProduction) {
      return "https://mover.dk/api/v3/";
    } else {
      return "https://mover.systems/api/v3/";
    }
  }
}
