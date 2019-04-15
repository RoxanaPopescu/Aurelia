import Localization from "../../localization";
import Base from "../../services/base";
import { Location } from "shared/src/model/general/location";
import { Address } from "shared/src/model/general/address";

export default class LocationService {
  static async addresses(query: string): Promise<Address[]> {
    try {
      let items: { [Key: string]: string } = {
        query: query
      };

      let response = await fetch(
        Base.url("locations/AddressAutocomplete"),
        Base.defaultConfig(items)
      );
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        return responseJson.results.map(result => new Address(result));
      } else {
        let responseJson = await response.json();
        if (
          responseJson.status === 401 ||
          responseJson.status === 422 ||
          responseJson.status === 500
        ) {
          throw new Error(responseJson.message);
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async getLocation(id: string, provider: string) {
    try {
      let items: { [Key: string]: string } = {
        id: id,
        provider: provider
      };

      let response = await fetch(
        Base.url("locations/Address"),
        Base.defaultConfig(items)
      );
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        return new Location(responseJson);
      } else {
        let responseJson = await response.json();
        if (
          responseJson.status === 401 ||
          responseJson.status === 422 ||
          responseJson.status === 500
        ) {
          throw new Error(responseJson.message);
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
