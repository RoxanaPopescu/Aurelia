import { observable } from "mobx";
import { OutfitData } from "./models/outfitData";

export class KpiStore {
  @observable error?: string;

  @observable outfitsData?: OutfitData[];

  @observable loading: boolean = true;

  @observable activeOutfitIndex: number = 0;

  @observable hovered?: { x: number; y: number };
}
