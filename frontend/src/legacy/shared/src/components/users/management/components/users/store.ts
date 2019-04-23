import { observable } from "mobx";
import User from "../../../../../model/profile/user";
import Localization from "shared/src/localization";

export class UsersListSortingKey {
  public static readonly map = {
    Id: {
      slug: "Id",
      value: 1
    },
    Initials: {
      slug: "Initials",
      value: 2
    },
    Username: {
      slug: "Username",
      value: 3
    },
    Name: {
      slug: "Name",
      value: 4
    },
    Email: {
      slug: "Email",
      value: 5
    },
    Roles: {
      slug: "Roles",
      value: 6
    }
  };

  public constructor(status: keyof typeof UsersListSortingKey.map) {
    Object.assign(this, UsersListSortingKey.map[status]);
  }

  public slug: keyof typeof UsersListSortingKey.map;
  public value: number;
}

export class UsersListStore {
  @observable loading: boolean = true;
  @observable error?: string;
  @observable users: User[] = [];
  @observable selectedUser?: User;

  headers = [
    {
      text: "",
      key: UsersListSortingKey.map.Initials.slug
    },
    {
      text: Localization.operationsValue("Users_List_Username"),
      key: UsersListSortingKey.map.Username.slug
    },
    {
      text: Localization.operationsValue("Users_List_Name"),
      key: UsersListSortingKey.map.Name.slug
    },
    {
      text: Localization.operationsValue("Users_List_Role"),
      key: UsersListSortingKey.map.Roles.slug
    }
  ];
}
