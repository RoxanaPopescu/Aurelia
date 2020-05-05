import Localization from "shared/src/localization";
import { Accent } from "../../general/accent";
import { textCase } from "shared/utilities";

/**
 * Represents the status of a route.
 */
export class RouteStatus {
  public static readonly map = {
    "not-started": {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:NotStarted"),
      accent: "neutral",
      value: 1
    },
    "in-progress": {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:InProgress"),
      accent: "neutral",
      value: 4
    },
    "not-approved": {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:NotApproved"),
      accent: "neutral",
      value: 4
    },
    "completed": {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Completed"),
      accent: "positive",
      value: 20
    },
    "cancelled": {
      name: Localization.sharedValue("Model_Logistics_RouteStatus:Cancelled"),
      accent: "neutral",
      value: 100
    }
  };

  public constructor(slug: keyof typeof RouteStatus.map) {
    this.slug = textCase(slug, "pascal", "kebab") as any;
    Object.assign(this, RouteStatus.map[this.slug]);
  }

  public slug: keyof typeof RouteStatus.map;
  public name: string;
  public accent: Accent;
  public value: number;
}
