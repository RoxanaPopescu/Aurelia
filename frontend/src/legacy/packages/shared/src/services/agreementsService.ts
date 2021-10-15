
import { OrganizationConnection } from "app/model/organization";
import Base from "shared/src/services/base";
import Localization from "../localization";
import { Profile } from "../model/profile";

export class AgreementsService {
  static async connections(): Promise<OrganizationConnection[]> {
    let response = await fetch(
      Base.url(`organizations/${Profile.organizationId}/connections`),
      Base.defaultConfig()
    );

    if (!response.ok) {
      throw new Error(Localization.sharedValue("Error_General"));
    } else {
      let responseJson = await response.json();
      return responseJson.map(connection => new OrganizationConnection(connection));
    }
  }
}
