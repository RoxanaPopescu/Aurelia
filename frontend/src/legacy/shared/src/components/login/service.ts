import Localization from "shared/src/localization";
import Base from "../../services/base";
import { OutfitType } from "../../model/logistics/outfit";

export class LoginService {
  static async login(type: OutfitType, username: string, password: string) {
    try {
      var items = {
        username: username,
        password: password
      };

      let response = await fetch(
        Base.url("login", {}),
        Base.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();

        if (type !== responseJson.outfitType) {
          throw new Error(
            Localization.sharedValue("Error_LoginIncorrectType")
              .replace("{login_type}", responseJson.outfitType)
              .replace("{type}", type)
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
