import Localization from "shared/src/localization";
import { Accent } from "../../general/accent";

/**
 * Represents the status of a route.
 */
export class RouteStatus {
  public static readonly map = {
    requested: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Requested"),
      accent: "neutral",
      value: 1
    },
    accepted: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Accepted"),
      accent: "neutral",
      value: 2
    },
    assigned: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Assigned"),
      accent: "neutral",
      value: 3
    },
    started: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Started"),
      accent: "neutral",
      value: 4
    },
    completed: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Completed"),
      accent: "positive",
      value: 20
    },
    cancelled: {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Cancelled"),
      accent: "neutral",
      value: 100
    }
  };

  public constructor(status: keyof typeof RouteStatus.map) {
    this.slug = status;
    Object.assign(this, RouteStatus.map[status]);
  }

  public slug: keyof typeof RouteStatus.map;
  public name: string;
  public accent: Accent;
  public value: number;
}
