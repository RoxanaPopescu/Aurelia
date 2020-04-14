import React from "react";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import UsersListComponent from "./components/users";
import { UserManagementStore } from "./store";
import RolesListComponent from "./components/roles";
import { SubPage } from "shared/src/utillity/page";
import { Redirect } from "react-router-dom";
import H from "history";
import { Switch } from "react-router";
import { ButtonSize, ButtonType } from "shared/src/webKit/button";
import ButtonAdd from "shared/src/webKit/button/add";
import { roleStore } from "./components/role";
import { Toast, ToastType } from "shared/src/webKit";
import RoleComponent from "./components/role/index";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

export const userManagementStore = new UserManagementStore();

interface Props {
  // tslint:disable-next-line:no-any
  match?: any;
  history: H.History;
}

@observer
export default class UserManagementComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue(
      "UserManagment_UserList_Title"
    );
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    userManagementStore.activeTab = this.props.match.params.page;
  }

  render() {
    return (
      <>

        {this.props.match.params.page === ":page" &&
        <Switch>
          <Redirect
            exact={true}
            from="/users/management/:page"
            to={SubPage.path(SubPage.UsersManagement).replace(":page", "users")}
          />
        </Switch>}

        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Brugere og roller" }
          ]}
          tabs={[
            { title: Localization.operationsValue("Users_List_Title"), name: "users", href: SubPage.path(SubPage.UsersManagement).replace(":page", "users") },
            { title: Localization.operationsValue("Users_Roles_Title"), name: "roles", href: SubPage.path(SubPage.UsersManagement).replace(":page", "roles") }
          ]}
          tab={userManagementStore.activeTab}
          onTabChange={tab => {
            userManagementStore.activeTab = tab;
          }}
        >

          {userManagementStore.activeTab === "users" &&
          <>
            <ButtonAdd
              size={ButtonSize.Medium}
              type={ButtonType.Light}
              onClick={() => this.props.history!.push(SubPage.path(SubPage.UsersCreate))}
            >
              {Localization.operationsValue("Users_NewUser")}
            </ButtonAdd>
          </>}

          {userManagementStore.activeTab === "roles" &&
          <>
            <ButtonAdd
              size={ButtonSize.Medium}
              type={ButtonType.Light}
              onClick={() => (roleStore.modalOpen = true)}
            >
              {Localization.operationsValue("Users_Roles:Button")}
            </ButtonAdd>
          </>}

        </PageHeaderComponent>

        <PageContentComponent>

          {userManagementStore.activeTab === "users" &&
          <UsersListComponent/>}

          {userManagementStore.activeTab === "roles" &&
          <RolesListComponent/>}

        </PageContentComponent>

        {roleStore.modalOpen && (
          <RoleComponent role={userManagementStore.activeRole} />
        )}

        {roleStore.success && (
          <Toast
            remove={() => (roleStore.success = undefined)}
            type={ToastType.Success}
          >
            {roleStore.success}
          </Toast>
        )}

      </>
    );
  }
}
