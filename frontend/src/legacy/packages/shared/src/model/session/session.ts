import Base from "../../services/base";
import { UserInfo } from "./userInfo";
import { VehicleType } from "../logistics/vehicleType";
import { Profile } from "../profile";
import { Fulfiller } from "../logistics/fulfiller";
import { Consignor } from "../logistics/consignor";

// True to fall back to using mock data if the start session call fails, otherwise false.
const useMockData = true;

/**
 * Represents reference data for the session.
 */
// tslint:disable-next-line:class-name
export class _Session {
  /**
   * The outfit for the user.
   */
  public outfit: Fulfiller | Consignor;

  /**
   * The user of the app.
   */
  public userInfo: UserInfo;

  /**
   * The available vehicle types.
   */
  public vehicleTypes: VehicleType[];

  /**
   * Updates the reference data.
   * Note that this must be caled before any of the data is accessed.
   * @returns True if the session was started correctly, otherwise false.
   */
  public async start(): Promise<boolean> {
    // tslint:disable-next-line: no-any
    let data: any;

    if (useMockData) {
      data = this.getMockData();
    } else {
      const response = await fetch(
        Base.url("session/start", {}),
        Base.defaultConfig({})
      );

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          Profile.logout();
          return false;
        }
        throw new Error("The start session request failed.");
      }

      data = await response.json();

      let accessToken = response.headers.get("Access-Token");
      let refreshToken = response.headers.get("Refresh-Token");
      if (accessToken && refreshToken) {
        Profile.setTokens(accessToken, refreshToken);
      }
    }

    this.userInfo = new UserInfo(data.userInfo);
    this.vehicleTypes = data.vehicleTypes.map(t => new VehicleType(t));

    switch (data.outfit.type) {
      case "Fulfiller":
        this.outfit = new Fulfiller(data.outfit);
        break;
      case "Consignor":
        this.outfit = new Consignor(data.outfit);
        break;
      default:
        throw new Error("Unexpected outfit type");
    }

    return true;
  }

  // tslint:disable-next-line: no-any
  private getMockData(): any {
    return {
      "vehicleTypes": [
        {
          "deprecated": false,
          "id": "165f348d-ea67-4c94-9b27-48f2be29d545",
          "slug": "car",
          "maxHeight": 0.8,
          "maxWidth": 0.8,
          "maxLength": 0.8,
          "maxWeight": 20.0,
          "name": {
            "en": "Car",
            "da": "Bil"
          },
          "images": {
            "pin": "https://moverstatic.azureedge.net/vehicle-types/car/pin.png",
            "small": "https://moverstatic.azureedge.net/vehicle-types/car/small.png",
            "large": "https://moverstatic.azureedge.net/vehicle-types/car/large.png"
          }
        },
        {
          "deprecated": false,
          "id": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
          "slug": "van",
          "maxHeight": 1.4,
          "maxWidth": 1.4,
          "maxLength": 2.2,
          "maxWeight": 900.0,
          "name": {
            "en": "Van",
            "da": "Varevogn"
          },
          "images": {
            "pin": "https://moverstatic.azureedge.net/vehicle-types/van/pin.png",
            "small": "https://moverstatic.azureedge.net/vehicle-types/van/small.png",
            "large": "https://moverstatic.azureedge.net/vehicle-types/van/large.png"
          }
        },
        {
          "deprecated": false,
          "id": "341d82d9-7883-4b5f-87b7-d0c492b78b7d",
          "slug": "moving-van",
          "maxHeight": 2.0,
          "maxWidth": 2.0,
          "maxLength": 3.5,
          "maxWeight": 900.0,
          "name": {
            "en": "Moving van",
            "da": "Liftvogn"
          },
          "images": {
            "pin": "https://moverstatic.azureedge.net/vehicle-types/moving-van/pin.png",
            "small": "https://moverstatic.azureedge.net/vehicle-types/moving-van/small.png",
            "large": "https://moverstatic.azureedge.net/vehicle-types/moving-van/large.png"
          }
        }
      ],
      "userInfo": {
        "userId": "992c490a-b915-42f8-bc47-8d5c08e9369d",
        "username": "connie@cooplogistik.dk",
        "firstName": "Connie",
        "lastName": "Hansen",
        "email": "connie@cooplogistik.dk",
        "outfitId": "573f5f57-a580-4c40-99b0-8fbeb396ebe9",
        "roleId": "2de604aa-ae29-4ea5-8fd7-bd997b1980ee"
      },
      "outfit": {
        "type": "Fulfiller",
        "id": "573f5f57-a580-4c40-99b0-8fbeb396ebe9",
        "publicId": "CoopLogistics",
        "companyName": "COOP Logistics",
        "contactPerson": "Driften",
        "contactEmail": "coop@mover.dk",
        "address": "",
        "contactPhone": {
          "number": ""
        }
      }
    };
  }
}

export const Session = new _Session();
