import Localization from "shared/src/localization";
import { Accent } from "../../general/accent";

/**
 * Represents the status of a route stop.
 */
export class RouteStopStatus {
  
  public static readonly map = {
    "not-visited": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:NotVisited"),
      accent: "neutral"
    },
    "arrived": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Arrived"),
      accent: "neutral"
    },
    "delivery-not-possible": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:DeliveryNotPossible"),
      accent: "negative"
    },
    "completed": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Completed"),
      accent: "positive"
    },
    "cancelled": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Cancelled"),
      accent: "negative"
    },
    "cancelled-by-user": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:CancelledByUser"),
      accent: "negative"
    },
    "cancelled-by-driver": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:CancelledByDriver"),
      accent: "negative"
    },
    "cancelled-by-system": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:CancelledBySystem"),
      accent: "neutral"
    }
  };

  public constructor(status: keyof typeof RouteStopStatus.map) {
    this.slug = status;
    Object.assign(this, RouteStopStatus.map[status]);
  }
  
  public slug: keyof typeof RouteStopStatus.map;
  public name: string;
  public accent: Accent;
}