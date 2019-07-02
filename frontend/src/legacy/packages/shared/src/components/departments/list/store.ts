import { observable } from "mobx";
import Localization from "shared/src/localization";
import { Outfit } from "shared/src/model/logistics/outfit";

export type DepartmentsListSortingKey = "PublicId" | "CompanyName";

export class DepartmentsListStore {
  @observable loading: boolean = true;
  @observable error?: string;
  @observable outfits: Outfit[] = [];
  @observable selectedOutfit?: Outfit;

  headers: { content: string; key: DepartmentsListSortingKey }[] = [
    {
      content: "Id",
      key: "PublicId"
    },
    {
      content: Localization.consignorValue("Departments_List_CompanyName"),
      key: "CompanyName"
    }
  ];
}
