import { Profile } from "../model/profile";
import { GUID } from "shared/src/webKit";

export default class BaseService {
  private static headers(formData: Boolean = false) {
    var headers = new Headers({
      Accept: "application/json"
    });

    if (formData === false) {
      headers.set("content-type", "application/json");
    }

    if (Profile.tokens) {
      headers.set("authorization", `Bearer ${Profile.tokens.access}`);
      headers.set("refresh-token", Profile.tokens.refresh);
    }

    headers.set("mover-correlationid", GUID.generate());

    return headers;
  }

  static defaultConfig(body?: {}): { [Key: string]: {} } {
    var config;

    if (body) {
      config = {
        method: "POST",
        headers: BaseService.headers(),
        body: JSON.stringify(body)
      };
    } else {
      config = {
        method: "GET",
        headers: BaseService.headers()
      };
    }

    return config;
  }

  static url(name: string, items: { [Key: string]: string } = {}, version: "v1" | "v2" = "v1"): string {
    var base = BaseService.baseURL(version) + name;

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

  static baseURL(version: "v1" | "v2"): string {
    return `api/${version}/`;
  }
}
