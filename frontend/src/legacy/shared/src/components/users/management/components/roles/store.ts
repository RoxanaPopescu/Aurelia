import { observable } from "mobx";
import User, { Role } from "../../../../../model/profile/user";

export class RolesListStore {
  @observable loading: boolean = true;
  @observable error?: string;
  @observable roles?: Role[];
  @observable selectedRole?: Role;
  @observable selectedUser?: User;

  headers = [
    {
      text: "Navn",
      key: "name"
    },
    {
      text: "",
      key: "actions"
    }
  ];
}
