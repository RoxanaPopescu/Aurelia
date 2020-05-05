import Localization from "shared/src/localization";
import { Accent } from "../../general/accent";
import { textCase } from "shared/utilities";

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
    "failed": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Failed"),
      accent: "negative"
    },
    "completed": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Completed"),
      accent: "positive"
    },
    "cancelled": {
      name: Localization.sharedValue("Model_Logistics_RouteStopStatus:Cancelled"),
      accent: "neutral"
    }
  };

  public constructor(slug: keyof typeof RouteStopStatus.map) {
    this.slug = textCase(slug, "pascal", "kebab") as any;
    Object.assign(this, RouteStopStatus.map[this.slug]);
  }

  public slug: keyof typeof RouteStopStatus.map;
  public name: string;
  public accent: Accent;
}
