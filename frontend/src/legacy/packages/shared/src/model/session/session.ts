import Base from "../../services/base";
import { ApiResult } from "shared/infrastructure";
import { UserInfo } from "./userInfo";
import { VehicleType } from "../logistics/vehicleType";
import { Profile } from "../profile";
import { Fulfiller } from "../logistics/fulfiller";
import { Consignor } from "../logistics/consignor";
import { Identity } from "app/services/identity";
import { Outfit } from "../logistics/outfit";

/**
 * Represents reference data for the session.
 */
// tslint:disable-next-line:class-name
export class _Session {
  /**
   * The outfit for the user.
   */
  public outfit: Fulfiller | Consignor | Outfit;

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
   * @param result The `session/start` result, if already fetched.
   * @returns True if the session was started correctly, otherwise false.
   */
  public async startOld(result?: ApiResult): Promise<boolean> {

    let data: any;

    if (result == null) {
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

      data = await result!.response.json();
    }
    else
    {
      data = result.data;
    }

    let accessToken = result!.response.headers.get("Access-Token");
    let refreshToken = result!.response.headers.get("Refresh-Token");
    if (accessToken && refreshToken) {
      Profile.setTokens(accessToken, refreshToken);
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

  /**
   * Same as `startOld`, but without the API call, so it works with the new authentication.
   */
  public startNew(identity: Identity, vehicleTypes: VehicleType[]): void {

    Profile.setTokens(identity.tokens.accessToken, identity.tokens.refreshToken);

    const [firstName, lastName] = identity.fullName.split(" ", 2);

    this.userInfo = new UserInfo({
      userId: identity.id,
      username: identity.username,
      firstName: firstName,
      lastName: lastName,
      email: identity.username
    });

    this.vehicleTypes = vehicleTypes.map(t => new VehicleType(t));

    switch (identity.outfit!.type.slug) {
      case "fulfiller":
        this.outfit = new Fulfiller(identity.outfit!);
        break;
      case "consignor":
        this.outfit = new Consignor(identity.outfit!);
        break;
      default:
        // TODO: This probably breaks something, somewhere.
        this.outfit = new Outfit(identity.outfit!, "Unknown");
    }
  }
}

export const Session = new _Session();
