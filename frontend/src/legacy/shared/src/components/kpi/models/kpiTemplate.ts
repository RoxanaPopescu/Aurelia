import { KpiGroup } from "./kpiGroup";

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
