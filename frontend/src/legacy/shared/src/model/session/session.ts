import Base from "../../services/base";
import { UserInfo } from "./userInfo";
import { VehicleType } from "../logistics/vehicleType";
import { Profile } from "../profile";
import { Fulfiller } from "../logistics/fulfiller";
import { Consignor } from "../logistics/consignor";

// True to fall back to using mock data if the start session call fails, otherwise false.
const useMockData = false;

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
      userInfo: { firstName: "mock" },
      vehicleTypes: [
        { id: "2321cbd7-5bed-4035-a827-2bfea31bb8e8", name: { da: "mock" } }
      ],
      outfit: { type: "Fulfiller" }
    };
  }
}

export const Session = new _Session();
