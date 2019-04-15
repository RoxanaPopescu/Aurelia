import { Profile } from "../model/profile";
import Localization from "shared/src/localization";

export default class Service {
  static async login(username: string, password: string) {
    try {
      var items = {
        username: username,
        password: password
      };

      let response = await fetch(
        Service.url("login", {}),
        Service.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();
        return responseJson;
      } else {
        if (response.status === 401) {
          throw new Error(Localization.operationsValue("Error_LoginNotAdmin"));
        } else if (response.status === 403) {
          throw new Error(Localization.sharedValue("Error_LoginIncorrect"));
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async driverLocationHistory(
    driverId: string,
    fromDate: string,
    toDate?: string,
    onlySampling: boolean = true
  ) {
    try {
      // tslint:disable-next-line:no-any
      var items: { [Key: string]: any } = {
        driverId: driverId,
        fromDate: fromDate,
        onlySampling: onlySampling
      };

      if (toDate) {
        items.toDate = toDate;
      }

      let response = await fetch(
        Service.url("driverLocationHistory", items),
        Service.defaultConfig()
      );
      let responseJson = await response.json();
      if (response.ok) {
        return responseJson;
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

  private static headers(token?: string, formData: Boolean = false) {
    var headers = new Headers({
      Accept: "application/json"
    });

    if (formData === false) {
      headers.set("Content-Type", "application/json");
    }

    let key = "Authorization";
    let userToken = "";
    if (token) {
      userToken = token;
    } else if (Profile.tokens) {
      userToken = Profile.tokens.access;
    }

    let value = "UserToken ".concat(userToken);
    headers.set(key, value);

    return headers;
  }

  static defaultConfig(body?: {}, token?: string): { [Key: string]: {} } {
    var config;

    if (body) {
      config = {
        method: "POST",
        headers: Service.headers(token),
        body: JSON.stringify(body)
      };
    } else {
      config = {
        method: "GET",
        headers: Service.headers(token)
      };
    }

    return config;
  }

  static url(name: string, items: { [Key: string]: string }): string {
    var base = Service.baseURL() + name;

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
    return "";
  }
}
