import Localization from "shared/src/localization";
import Base from "../../services/base";

export class LoginService {
  static async login(username: string, password: string) {
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
