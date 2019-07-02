import React from "react";
import H from "history";
import "./styles.scss";
import Localization from "shared/src/localization";
import {
  Input,
  Button,
  ButtonType,
  Toast,
  ToastType,
  Select,
  ButtonSize
} from "shared/src/webKit";
import { observer } from "mobx-react";
import { SelectOptionValue } from "shared/src/webKit/select";
import UserManagementService from "../service";
import { UserStore } from "./store";
import DepartmentsService from "../../departments/service";
import { Session } from "shared/src/model/session";
import { PageHeaderComponent } from "../../pageHeader";
import { SubPage } from "shared/src/utillity/page";
import { PageContentComponent } from "../../pageContent";

export const userStore = new UserStore();

interface Props {
  // tslint:disable-next-line:no-any
  match?: any;
  history?: H.History;
}

@observer
export default class UserComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = "Bruger " + props.match.params.id;

    this.getUser(props.match.params.id);
  }

  componentDidMount() {
    userStore.error = undefined;

    DepartmentsService.list()
      .then(outfits => {
        userStore.availableDepartments = outfits;

        if (userStore.user) {
          userStore.departmentId = userStore.user.outfitId;
        }
      })
      .catch(error => {
        userStore.error = error.message;
      });

    UserManagementService.listRoles()
      .then(roles => {
        userStore.availableRoles = roles;

        if (userStore.user) {
          userStore.role = userStore.user.role;
        }
      })
      .catch(error => {
        userStore.error = error.message;
      });
  }

  getUser(id: string) {
    UserManagementService.getUser(id)
      .then(user => {
        userStore.user = user;

        if (userStore.availableRoles) {
          userStore.role = userStore.availableRoles.find(r => r.id === user.role.id);
        }
        if (userStore.availableDepartments) {
          userStore.departmentId = user.outfitId;
        }
      })
      .catch(error => {
        userStore.error = error.message;
      });
  }

  requestPasswordReset() {
    if (confirm("Er du sikker på du vil nulstille passwordet for denne bruger?")) {
      userStore.loading = true;

      UserManagementService.requestPasswordReset(userStore.user!.username)
      .then(user => {
        userStore.loading = false;
        userStore.toastMessage = "Brugeren har fået en mail med et reset password link";
      })
      .catch(error => {
        userStore.loading = false;
        userStore.error = error.message;
      });
    }
  }

  deactivate() {
    if (confirm("Sikker på du vil deaktivere denne bruger?")) {
      userStore.loading = true;

      UserManagementService.deactivate(userStore.user!.username)
      .then(user => {
        userStore.loading = false;

        userStore.toastMessage = "Brugeren er blevet deaktiveret";
        userStore.user!.canDeactivate = false;
      })
      .catch(error => {
        userStore.loading = false;
        userStore.error = error.message;
      });
    }
  }

  updateRole() {
    userStore.validate = true;
    if (userStore.role === undefined || userStore.user === undefined) {
      return;
    }
    userStore.error = undefined;
    userStore.loading = true;
    userStore.validate = false;

    UserManagementService.updateUser(userStore.user.id, userStore.role)
      .then(user => {
        userStore.roleUpdated = true;
        userStore.loading = false;
        userStore.user = user;
      })
      .catch(error => {
        userStore.loading = false;
        userStore.error = error.message;
      });
  }

  rolesOptions(): SelectOptionValue[] {
    if (!userStore.availableRoles) {
      return [];
    }

    let options: SelectOptionValue[] = userStore.availableRoles.map(role => {
      return { label: role.name ? role.name : role.id, value: role.id };
    });

    return options;
  }

  departmentsOptions(): SelectOptionValue[] {
    if (!userStore.availableDepartments) {
      return [];
    }

    let options: SelectOptionValue[] = [
      {
        label: Session.outfit.primaryName,
        value: Session.outfit.id
      }
    ];

    let departmentOptions: SelectOptionValue[] = userStore.availableDepartments.map(
      department => {
        return { label: department.primaryName, value: department.id };
      }
    );

    options = options.concat(departmentOptions);
    return options;
  }

  render() {
    let userTitle = userStore.user
    ? userStore.user!.fullName.toString()
    : "Henter bruger...";

    return (
      <>

        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Brugere", href: SubPage.path(SubPage.UsersManagement) },
            { title:  userTitle}
          ]}
        >
          <Button
            type={ButtonType.Action}
            size={ButtonSize.Medium}
            className="c-users-create-sendButton"
            onClick={() => this.updateRole()}
            disabled={userStore.loading}
          >
            {Localization.operationsValue("Users_Update:Button")}
          </Button>
          { userStore.user && userStore.user.canDeactivate && 
            <Button
              type={ButtonType.Neutral}
              size={ButtonSize.Medium}
              className="c-users-create-sendButton"
              onClick={() => this.deactivate()}
              disabled={userStore.loading}
            >
              Deaktiver brugeren
            </Button> 
          }
          { userStore.user && 
            <Button
              type={ButtonType.Neutral}
              size={ButtonSize.Medium}
              className="c-users-create-sendButton"
              onClick={() => this.requestPasswordReset()}
              disabled={userStore.loading}
            >
              Nulstil password
            </Button> 
          }
        </PageHeaderComponent>
        <PageContentComponent className="c-users-user">
        
          <Select
            size={"medium"}
            headline={Localization.operationsValue(
              "Departments_Create_ParentId"
            )}
            className="c-departments-input"
            placeholder={Localization.sharedValue("General_Loading")}
            value={userStore.departmentId}
            readonly={true}
            options={this.departmentsOptions()}
            onSelect={() => {
              /* */
            }}
          />
          <Select
            size={"medium"}
            headline={Localization.sharedValue("Users_Create_Role:Headline")}
            className="c-userManagement-roles"
            disabled={
              userStore.availableRoles === undefined || userStore.loading
            }
            error={userStore.validate && userStore.user === undefined}
            placeholder={
              userStore.availableRoles
                ? Localization.sharedValue("Users_Create_Role:Placeholder")
                : Localization.sharedValue("General_Loading")
            }
            value={userStore.role ? userStore.role.id : undefined}
            options={this.rolesOptions()}
            onSelect={option => {
              if (option) {
                userStore.role = userStore.availableRoles!.find(r => r.id === option.value);
              } else {
                userStore.role = undefined;
              }
            }}
          />
          <Input
            headline={Localization.operationsValue("Users_Create_FirstName")}
            onChange={() => {
              /* */
            }}
            value={userStore.user && userStore.user.firstName}
            size={"medium"}
            readonly={true}
            className="c-users-create-input"
          />
          <Input
            headline={Localization.operationsValue("Users_Create_LastName")}
            onChange={() => {
              /* */
            }}
            value={userStore.user && userStore.user.lastName}
            size={"medium"}
            readonly={true}
            className="c-users-create-input"
          />
          <Input
            headline={Localization.operationsValue("Users_Create_Email")}
            onChange={() => {
              /* */
            }}
            value={userStore.user && userStore.user.email}
            size={"medium"}
            readonly={true}
            className="c-users-create-input"
            type={"email"}
          />

        </PageContentComponent>

        {userStore.error && (
          <Toast
            remove={() => (userStore.error = undefined)}
            type={ToastType.Alert}
          >
            {userStore.error}
          </Toast>
        )}

        {userStore.roleUpdated &&
          userStore.id && (
            <Toast
              remove={() => (userStore.roleUpdated = false)}
              type={ToastType.Success}
            >
              {Localization.operationsValue("Users_Update:").replace(
                "{user}",
                userStore.id
              )}
            </Toast>
          )}
          { userStore.toastMessage &&
            <Toast
              remove={() => (userStore.toastMessage = undefined)}
              type={ToastType.Success}
            >
              {userStore.toastMessage}
            </Toast>
          }
      </>
    );
  }
}
