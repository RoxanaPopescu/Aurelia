import { observable } from "mobx";
import { Outfit } from "shared/src/model/logistics/outfit";

export class AgreementsListStore {
  @observable loading: boolean = true;
  @observable error?: string;
  @observable agreements: Outfit[] = [];
}
