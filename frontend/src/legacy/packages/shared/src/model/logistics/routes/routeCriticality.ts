import Localization from "shared/src/localization";

/**
 * Represents the criticality of a route, which is an indication of 
 * how much attention it requires from the operations team.
 */
export class RouteCriticality {
  public static readonly map = {
    "high": {
      name: Localization.sharedValue("Model_Logistics_RouteCriticality:High"),
      rank: 2
    },
    "medium": {
      name: Localization.sharedValue("Model_Logistics_RouteCriticality:Medium"),
      rank: 1
    },
    "low": {
      name: Localization.sharedValue("Model_Logistics_RouteCriticality:Low"),
      rank: 0
    }
  };

  public constructor(criticality: keyof typeof RouteCriticality.map) {
    this.slug = criticality;
    Object.assign(this, RouteCriticality.map[criticality]);
  }

  public slug: keyof typeof RouteCriticality.map;
  public name: string;
  public rank: number;
}