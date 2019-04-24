import { DateTime } from "luxon";
import { KpiTemplate } from ".";
import { Outfit } from "shared/src/model/logistics/outfit";
import { KpiFormat } from "./kpiFormat";

/**
 * Represents a single KPI.
 */
export class OutfitData {
  /* tslint:disable-next-line: no-any */
  public constructor(
    fulfiller: Outfit | undefined,
    toDate: DateTime,
    toDateChosen: DateTime,
    format: KpiFormat,
    consignorKpi?: KpiTemplate
  ) {
    this.outfit = fulfiller;
    this.toDate = toDate;
    this.toDateChosen = toDateChosen;
    this.outfitKpi = consignorKpi;
    this.format = format;
  }

  /**
   * The outfit
   */
  public outfit: Outfit | undefined;

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
