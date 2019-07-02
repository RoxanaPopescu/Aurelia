import { Kpi } from "./kpi";

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
