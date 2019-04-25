import React from "react";
import "./styles.scss";
import { Toast, ToastType } from "shared/src/webKit";
import { observer } from "mobx-react";
import { UsersListStore } from "./store";
import User from "../../../../../model/profile/user";
import { TableComponent } from "../../../../../webKit/table/index";
import Localization from "../../../../../localization";
import UserManagementService from "../../../service";
import { SubPage } from "shared/src/utillity/page";

export const userListStore = new UsersListStore();

@observer
export default class UsersListComponent extends React.Component {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Users_List_Title");
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    userListStore.loading = true;
    userListStore.error = undefined;

    UserManagementService.getUsers()
      .then(users => {
        userListStore.users = users;
        userListStore.loading = false;
      })
      .catch(error => {
        userListStore.error = error.message;
        userListStore.loading = false;
      });
  }

  getUserInitials(user: User) {
    return (
      <div className="c-users-list-initials">{`${user.firstName.charAt(
        0
      )}${user.lastName.charAt(0)}`}</div>
    );
  }

  getRows(users: User[]) {
    return users.map(user => {
      return [
        this.getUserInitials(user),
        user.username,
        user.fullName,
        user.role.name
      ];
    });
  }

  render() {
    return (
      <div className="c-users-list">
        <TableComponent
          gridTemplateColumns="120px auto 35% 35%"
          generateURL={index => {
            return SubPage.path(SubPage.UsersDetails).replace(
              ":id",
              userListStore.users[index].id.toString()
            );
          }}
          data={{
            headers: userListStore.headers,
            rows: this.getRows(userListStore.users)
          }}
          loading={userListStore.loading}
        />
        {userListStore.error && (
          <Toast
            type={ToastType.Alert}
            remove={() => (userListStore.error = undefined)}
          >
            {userListStore.error}
          </Toast>
        )}
      </div>
    );
  }
}
