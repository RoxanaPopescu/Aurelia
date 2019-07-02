import Base from "shared/src/services/base";
import { Outfit } from "shared/src/model/logistics/outfit";
import Localization from "shared/src/localization";
import { Consignor } from "shared/src/model/logistics/consignor";
import { Fulfiller } from "../../model/logistics/fulfiller";

export default class DepartmentsService {
  static async list() {
    let response = await fetch(
      Base.url("Departments/List"),
      Base.defaultConfig()
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    let responseJson = await response.json();

    try {
      return responseJson.map(outfit => {
        if (outfit.type === "Consignor") {
          return new Consignor(outfit);
        } else if (outfit.type === "Fulfiller") {
          return new Fulfiller(outfit);
        } else {
          return new Outfit(outfit);
        }
      });
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  static async create(name: string, publicId: string, parentId?: string) {
    // tslint:disable-next-line:no-any
    let json: any = {
      companyName: name,
      publicId: publicId
    };

    if (parentId) {
      json.parentId = parentId;
    }

    let response = await fetch(
      Base.url("Departments/Create"),
      Base.defaultConfig(json)
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return;
  }

  static async update(id: string, name: string) {
    // tslint:disable-next-line:no-any
    let json: any = {
      id: id,
      name: name
    };

    let response = await fetch(
      Base.url("Departments/Update"),
      Base.defaultConfig(json)
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  static async details(publicId: string) {
    // tslint:disable-next-line:no-any
    let json: any = {
      publicId: publicId
    };

    let response = await fetch(
      Base.url("departments/details"),
      Base.defaultConfig(json)
    );

    let responseJson = await response.json();

    try {
      return new Outfit(responseJson);
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }
}
