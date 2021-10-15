
import { OrganizationConnection } from "app/model/organization";
import Base from "shared/src/services/base";
import Localization from "../localization";

export class AgreementsService {
  static async connections(): Promise<OrganizationConnection[]> {
    // FIXME: Use correct ORG
    var organizationId = "dasd";

    let response = await fetch(
      Base.url(`organizations/${organizationId}/connections`),
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
