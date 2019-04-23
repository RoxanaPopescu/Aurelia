import { observable } from "mobx";
import Localization from "shared/src/localization";
import { Outfit } from "shared/src/model/logistics/outfit";

export type DepartmentsListSortingKey = "PublicId" | "CompanyName";

export class DepartmentsListStore {
  @observable loading: boolean = true;
  @observable error?: string;
  @observable outfits: Outfit[] = [];
  @observable selectedOutfit?: Outfit;

  headers: { text: string; key: DepartmentsListSortingKey }[] = [
    {
      text: "Id",
      key: "PublicId"
    },
    {
      text: Localization.consignorValue("Departments_List_CompanyName"),
      key: "CompanyName"
    }
  ];
}
