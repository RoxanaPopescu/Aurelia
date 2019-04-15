import { observable } from "mobx";
import { Role } from "shared/src/model/profile/user";

export class UserManagementStore {
  @observable error?: string;

  @observable loading: boolean = true;

  @observable activeTab: string;

  @observable activeRole?: Role;
}
