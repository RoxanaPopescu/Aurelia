import Localization from "shared/src/localization";
import Base from "../../services/base";
import { OutfitType } from "../../model/logistics/outfit";

export class ActivationService {
  static async activateAndLogin(
    userType: OutfitType,
    password: string,
    username: string,
    activationCode: string
  ) {
    try {
      var items = {
        newPassword: password,
        activationCode: activationCode,
        username: username
      };

      let response = await fetch(
        Base.url("activation", {}),
        Base.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();

        if (userType !== responseJson.outfitType) {
          throw new Error(
            Localization.sharedValue("Error_LoginIncorrectType")
              .replace("{login_type}", responseJson.outfitType)
              .replace("{type}", userType)
          );
        }

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
}
