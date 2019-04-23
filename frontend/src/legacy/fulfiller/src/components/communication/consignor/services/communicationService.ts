import { observable } from "mobx";
import BaseService from "shared/src/services/base";
import { CommunicationSettings } from "./models/communicationSettings";
import { AgreementsService } from "shared/src/services/agreementsService";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents a service that manages the settings for a consignor.
 */
export class CommunicationService {
  /**
   * True if the service is busy, otherwise false.
   */
  @observable
  public busy = false;

  /**
   * The consignors for whom settings may be specified.
   */
  @observable
  public consignors: Consignor[] | undefined;

  /**
   * The settings for the current consignor.
   */
  @observable
  public settings: CommunicationSettings | undefined;

  /**
   * The ID of the current consignor.
   */
  @observable
  public consignorId: string | undefined;

  /**
   * Gets the list of consigners from whom settings may be specified.
   * @returns The list of consignors.
   */
  public async loadConsignors(): Promise<void> {
    this.busy = true;
    this.consignors = undefined;

    try {
      const fulfilees = await AgreementsService.fulfilees();
      this.consignors = fulfilees.filter(f => f instanceof Consignor) as Consignor[];
    } catch {
      // Do nothing
    }

    this.busy = false;
  }

  /**
   * Loads the settings for the specified consignor.
   * @param consignorId The ID of the consignor.
   */
  public async loadSettings(consignorId: string): Promise<void> {
    this.consignorId = consignorId;
    this.busy = true;
    this.settings = undefined;

    const response = await fetch(
      BaseService.url("communication/consignor/getSettings", {
        id: consignorId
      }),
      BaseService.defaultConfig()
    );

    this.busy = false;
    if (response.status === 400) {
      // Create empty setting
      this.settings = new CommunicationSettings();
      this.settings.consignorId = consignorId;
      this.settings.slug = consignorId;
    } else if (!response.ok) {
      throw new Error("Could not load communication settings for consignor.");
    } else {
      const data = await response.json();
      this.settings = new CommunicationSettings(data);
    }
  }

  /**
   * Saves the settings for the current consignor.
   */
  public async saveSettings(): Promise<void> {
    this.busy = true;

    const response = await fetch(
      BaseService.url("communication/consignor/saveSettings"),
      BaseService.defaultConfig(this.settings)
    );

    if (!response.ok) {
      this.busy = false;
      throw new Error("Could not save communication settings for consignor.");
    }

    this.busy = false;
  }
}
