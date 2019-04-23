import { observable, action } from "mobx";
import { Outfit } from "../../../model/logistics/outfit";

export class DepartmentStore {
  @observable loading: boolean = false;
  @observable error?: string;
  @observable success?: string;
  @observable validate: boolean;
  @observable departments?: Outfit[];

  @observable departmentId?: string;
  @observable departmentName?: string;
  @observable departmentParentId?: string;
  @observable departmentPublicId?: string;

  @action
  reset() {
    this.validate = false;
    this.departmentId = undefined;
    this.departmentName = undefined;
    this.departmentParentId = undefined;
    this.departmentPublicId = undefined;
  }
}
