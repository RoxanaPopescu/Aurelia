import Base from "shared/src/services/base";
import { Outfit } from "shared/src/model/logistics/outfit";
import Localization from "shared/src/localization";
import { Consignor } from "shared/src/model/logistics/consignor";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Phone } from "../model/general/phone";

export class AgreementsService {
  static async inviteFulfiller(
    publicId: string, 
    companyName: string, 
    firstName: string, 
    lastName: string, 
    email: string
  ) {
    var items = {
      publicId: publicId,
      companyName: companyName,
      firstName: firstName,
      lastName: lastName,
      email: email
    };

    let response = await fetch(
      Base.url("Agreements/Fulfillers/Invite"),
      Base.defaultConfig(items)
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return;
  }

  static async inviteConsignor(
    publicId: string, 
    companyName: string, 
    firstName: string, 
    lastName: string, 
    email: string,
    phone: Phone,
    address: string
  ) {
    var items = {
      publicId: publicId,
      companyName: companyName,
      firstName: firstName,
      lastName: lastName,
      contactPhone: phone,
      email: email,
      address: address
    };

    let response = await fetch(
      Base.url("Agreements/Fulfilees/Invite"),
      Base.defaultConfig(items)
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    }

    return;
  }

  static async fulfillers(): Promise<Outfit[]> {
    let response = await fetch(
      Base.url("Agreements/Fulfillers/List"),
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

  static async fulfilees(): Promise<Outfit[]> {
    let response = await fetch(
      Base.url("Agreements/Fulfilees/List"),
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

  static async allAgreements() {
    let fulfillers: Outfit[] = await AgreementsService.fulfillers();
    let fulfilees: Outfit[] = await AgreementsService.fulfilees();

    return fulfillers.concat(fulfilees);
  }
}
