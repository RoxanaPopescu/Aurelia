import Localization from "shared/src/localization";
import Base from "../../services/base";
import { OutfitType } from "../../model/logistics/outfit";

export class ResetPasswordService {
  async resetAndLogin(
    userType: OutfitType,
    password: string,
    username: string,
    token: string
  ) {
    try {
      var items = {
        newPassword: password,
        token: token,
        username: username
      };

      let response = await fetch(
        Base.url("ResetPassword", {}),
        Base.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();

        if (userType && userType !== responseJson.outfitType) {
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
