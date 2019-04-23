import { observable } from "mobx";
import User from "../../../model/profile/user";
import { Outfit } from "shared/src/model/logistics/outfit";
import { Role } from "../../../model/profile/user";

export class UserStore {
  @observable loading: boolean = false;
  @observable error?: string;
  @observable validate: boolean = false;
  @observable roleUpdated: boolean = false;

  @observable id?: string;
  @observable user?: User;
  @observable availableDepartments?: Outfit[];
  @observable departmentId?: string;
  @observable availableRoles?: Role[];
  @observable role?: Role;
}
