import Localization from "shared/src/localization";

export class KpiFormat {
  public static readonly map = {
    numbers: {
      slug: "numbers",
      name: Localization.sharedValue("Kpi_Format:Numbers"),
      value: 1
    },
    percentage: {
      slug: "percentage",
      name: Localization.sharedValue("Kpi_Format:Percentage"),
      value: 2
    }
  };

  public constructor(status: keyof typeof KpiFormat.map) {
    Object.assign(this, KpiFormat.map[status]);
  }

  public slug: keyof typeof KpiFormat.map;
  public name: string;
  public value: number;
}
