import Base from "shared/src/services/base";
import { Outfit } from "shared/src/model/logistics/outfit";
import Localization from "shared/src/localization";
import { Phone } from "../model/general/phone";
import { delay } from "shared/utilities";

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
    // FIXME: Cleanup when connections has been made
    await delay(100);
    return [];
  }

  static async fulfilees(): Promise<Outfit[]> {
    // FIXME: Cleanup when connections has been made
    await delay(100);
    return [];
  }

  static async allAgreements() {
    let fulfillers: Outfit[] = await AgreementsService.fulfillers();
    let fulfilees: Outfit[] = await AgreementsService.fulfilees();

    return fulfillers.concat(fulfilees);
  }
}
