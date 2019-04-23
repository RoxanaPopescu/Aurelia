import { observable } from "mobx";
import { OutfitData } from "../models/outfitData";

export class FulfillerKpiStore {
  @observable error?: string;

  @observable email?: string;
  @observable password?: string;
  @observable consignorsData?: OutfitData[];
  @observable activeConsignorIndex: number = 0;
  @observable hovered?: { x: number; y: number };
}
