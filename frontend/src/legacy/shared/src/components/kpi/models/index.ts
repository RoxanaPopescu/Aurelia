/**
 * Represents a single KPI.
 */
export class Kpi {
  // tslint:disable-next-line:no-any
  public constructor(headline: string, value: any) {
    this.headline = headline;
    this.value = value;
  }

  /**
   * The headline of the KPI
   */
  public readonly headline: string;

  /**
   * The value of the KPI
   */
  // tslint:disable-next-line:no-any
  public readonly value: any;
}

/**
 * Represents a KPI group.
 */
export class KpiGroup {
  public constructor(headline: string, kpis: Kpi[]) {
    this.title = headline;
    this.kpis = kpis;
  }

  /**
   * The headline of the KPI group
   */
  public readonly title: string;

  /**
   * The KPIs
   */
  public readonly kpis: Kpi[];
}

/**
 * Represents a template of KPIs.
 */
export class KpiTemplate {
  public constructor(
    days: [
      KpiGroup[],
      KpiGroup[],
      KpiGroup[],
      KpiGroup[],
      KpiGroup[],
      KpiGroup[],
      KpiGroup[],
      KpiGroup[]
    ],
    last7Days: KpiGroup[],
    last30Days: KpiGroup[]
  ) {
    this.days = days;
    this.last7Days = last7Days;
    this.last30Days = last30Days;
  }

  /**
   * KPI groups of every single day the past 8 days
   */
  public readonly days: [
    KpiGroup[],
    KpiGroup[],
    KpiGroup[],
    KpiGroup[],
    KpiGroup[],
    KpiGroup[],
    KpiGroup[],
    KpiGroup[]
  ];

  /**
   * A KPI group of
   */
  public readonly last7Days: KpiGroup[];

  /**
   * The headline of the KPI
   */
  public readonly last30Days: KpiGroup[];
}
