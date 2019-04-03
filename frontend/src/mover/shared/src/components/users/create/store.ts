import { observable } from "mobx";
import { Outfit } from "shared/src/model/logistics/outfit";

export class CreateUserStore {
  @observable firstName?: string;
  @observable lastName?: string;
  @observable email?: string;
  @observable loading: boolean = false;
  @observable error?: string;
  @observable validate: boolean = false;
  @observable createdUser?: string;
  @observable availableDepartments?: Outfit[];
  @observable departmentId?: string;
  @observable availableRoles?: { name: string; id: string }[];
  @observable roleId?: string;
}
