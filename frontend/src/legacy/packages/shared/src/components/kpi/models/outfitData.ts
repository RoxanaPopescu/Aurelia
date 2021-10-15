import { OrganizationConnection } from "app/model/organization";
import { DateTime } from "luxon";
import { KpiTemplate } from ".";
import { KpiFormat } from "./kpiFormat";

/**
 * Represents a single KPI.
 */
export class OutfitData {
  /* tslint:disable-next-line: no-any */
  public constructor(
    connection: OrganizationConnection | undefined,
    toDate: DateTime,
    toDateChosen: DateTime,
    format: KpiFormat,
    consignorKpi?: KpiTemplate
  ) {
    this.connection = connection;
    this.toDate = toDate;
    this.toDateChosen = toDateChosen;
    this.outfitKpi = consignorKpi;
    this.format = format;
  }

  /**
   * The outfit
   */
  public connection: OrganizationConnection | undefined;

  /**
   * The date time selected
   */
  public toDate: DateTime;

  /**
   * The date time chosen for the data to be shown
   */
  public toDateChosen: DateTime;

  /**
   * The format chosen for the data to be shown in
   */
  public format: KpiFormat;

  /**
   * The outfit KPI
   */
  public outfitKpi?: KpiTemplate;
}
