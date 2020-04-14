import React from "react";
import "./styles.scss";
import { Toast, ToastType } from "shared/src/webKit";
import { observer } from "mobx-react";
import { RolesListStore } from "./store";
import UserManagementService from "../../../service";
import { Role } from "shared/src/model/profile/user";
import {
  Button,
  ButtonType,
  ButtonSize
} from "../../../../../webKit/button/index";
import { roleStore } from "../role";
import { userManagementStore } from "../../index";
import Localization from "shared/src/localization";

export const rolesListStore = new RolesListStore();

@observer
export default class RolesListComponent extends React.Component {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Users_Roles_Title");
  }

  componentDidMount() {
    this.fetchRoles();
  }

  fetchRoles() {
    rolesListStore.loading = true;
    rolesListStore.error = undefined;

    UserManagementService.listRoles()
      .then(roles => {
        rolesListStore.roles = roles;
        rolesListStore.loading = false;
      })
      .catch(error => {
        rolesListStore.error = error.message;
        rolesListStore.loading = false;
      });
  }

  fetchRole(id: string) {
    rolesListStore.loading = true;
    rolesListStore.error = undefined;

    UserManagementService.getRole(id)
      .then(role => {
        rolesListStore.selectedRole = role;
        rolesListStore.loading = false;
      })
      .catch(error => {
        rolesListStore.error = error.message;
        rolesListStore.loading = false;
      });
  }

  getHeaders() {
    return (
      <div className="c-users-roles-headers">
        <div className="font-heading">{rolesListStore.headers[0].text}</div>
        <div className="font-heading">{rolesListStore.headers[1].text}</div>
      </div>
    );
  }

  getRow(role: Role) {
    return (
      <div key={role.id} className="c-users-role">
        <div
          className={`${"c-users-role-head"}
            ${rolesListStore.loading ? " loading" : ""}
            ${
              rolesListStore.selectedRole &&
              rolesListStore.selectedRole.id === role.id
                ? " active"
                : ""
            }
          `}
          onClick={() => {
            if (
              !rolesListStore.selectedRole ||
              rolesListStore.selectedRole.id !== role.id
            ) {
              this.fetchRole(role.id);
            } else {
              rolesListStore.selectedRole = undefined;
            }
          }}
        >
          <div>{role.name}</div>
          <div>
            <Button
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                userManagementStore.activeRole = role;
                roleStore.modalOpen = true;
              }}
              size={ButtonSize.Medium}
              type={ButtonType.Light}
            >
              {Localization.operationsValue("Users_Roles_Edit")}
            </Button>
            <div className="c-users-role-chevron" />
          </div>
        </div>
        {rolesListStore.selectedRole &&
          rolesListStore.selectedRole.id === role.id && (
            <div className="c-users-role-details">
              <div className="c-users-role-title font-heading">{Localization.operationsValue("Users_Roles_Functions")}</div>
              <div className="c-users-role-claims">
                {rolesListStore.selectedRole.claimGroups!.map(claim => {
                  return (
                    <div className="c-users-role-claim" key={claim.id}>
                      {claim.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  }

  getRows() {
    if (rolesListStore.roles) {
      return (
        <>
          {rolesListStore.roles.map(role => {
            return this.getRow(role);
          })}
        </>
      );
    } else {
      return (
        <>
          <div className="c-users-role c-users-role-skeleton">
            <div className="c-users-role-head" />
          </div>
          <div className="c-users-role c-users-role-skeleton">
            <div className="c-users-role-head" />
          </div>
          <div className="c-users-role c-users-role-skeleton">
            <div className="c-users-role-head" />
          </div>
        </>
      );
    }
  }

  render() {
    let classNames = "c-users-roles";
    if (rolesListStore.loading && rolesListStore.roles) {
      classNames += " c-users-roles-loading";
    }
    return (
      <div className={classNames}>
        {this.getHeaders()}
        {this.getRows()}
        {rolesListStore.error && (
          <Toast
            type={ToastType.Alert}
            remove={() => (rolesListStore.error = undefined)}
          >
            {rolesListStore.error}
          </Toast>
        )}
      </div>
    );
  }
}
