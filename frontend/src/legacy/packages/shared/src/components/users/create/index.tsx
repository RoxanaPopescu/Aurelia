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
import { CreateUserStore } from "./store";
import { observer } from "mobx-react";
import Validation from "../../../webKit/utillity/validation";
import { SelectOptionValue } from "shared/src/webKit/select";
import { Session } from "shared/src/model/session";
import DepartmentsService from "../../departments/service";
import UserManagementService from "../service";
import { PageHeaderComponent } from "../../pageHeader";
import { SubPage } from "shared/src/utillity/page";
import { PageContentComponent } from "../../pageContent";

export const createUserStore = new CreateUserStore();

interface Props {
  history?: H.History;
}

@observer
export default class CreateUserComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Users_PageTitle");
  }

  componentDidMount() {
    createUserStore.error = undefined;

    DepartmentsService.list()
      .then(outfits => {
        createUserStore.availableDepartments = outfits;
      })
      .catch(error => {
        createUserStore.error = error.message;
      });

    UserManagementService.listRoles()
      .then(roles => {
        createUserStore.availableRoles = roles;
      })
      .catch(error => {
        createUserStore.error = error.message;
      });
  }

  createUser() {
    createUserStore.validate = true;
    if (
      createUserStore.firstName === undefined ||
      createUserStore.lastName === undefined ||
      createUserStore.email === undefined ||
      createUserStore.departmentId === undefined ||
      createUserStore.roleId === undefined ||
      Validation.email(createUserStore.email) === false
    ) {
      return;
    }
    createUserStore.error = undefined;
    createUserStore.loading = true;
    createUserStore.validate = false;
    createUserStore.createdUser = undefined;

    UserManagementService.createUser(
      createUserStore.firstName,
      createUserStore.lastName,
      createUserStore.email,
      createUserStore.departmentId,
      createUserStore.roleId
    )
      .then(() => {
        createUserStore.loading = false;
        createUserStore.createdUser = createUserStore.email;

        createUserStore.firstName = undefined;
        createUserStore.lastName = undefined;
        createUserStore.email = undefined;
      })
      .catch(error => {
        createUserStore.loading = false;
        createUserStore.error = error.message;
      });
  }

  rolesOptions(): SelectOptionValue[] {
    if (!createUserStore.availableRoles) {
      return [];
    }

    let options: SelectOptionValue[] = createUserStore.availableRoles.map(
      role => {
        return { label: role.name, value: role.id };
      }
    );

    return options;
  }

  departmentsOptions(): SelectOptionValue[] {
    if (!createUserStore.availableDepartments) {
      return [];
    }

    let options: SelectOptionValue[] = [
      {
        label: Session.outfit.primaryName,
        value: Session.outfit.id
      }
    ];

    let departmentOptions: SelectOptionValue[] = createUserStore.availableDepartments.map(
      department => {
        return { label: department.primaryName, value: department.id };
      }
    );

    options = options.concat(departmentOptions);
    return options;
  }

  render() {
    return (
      <>

        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: Localization.operationsValue("Users_List_Title"), href: SubPage.path(SubPage.UsersManagement) },
            { title: Localization.operationsValue("Users_NewUser") }
          ]}
        >

          <Button
            type={ButtonType.Action}
            size={ButtonSize.Medium}
            className="c-users-create-sendButton"
            onClick={() => this.createUser()}
            disabled={createUserStore.loading}
          >
            {Localization.operationsValue("Users_Create_SendInvite")}
          </Button>

        </PageHeaderComponent>

        <PageContentComponent className="c-users-create">

          <Select
            size={"medium"}
            headline={Localization.operationsValue(
              "Departments_Create_ParentId"
            )}
            className="c-departments-input"
            disabled={
              createUserStore.availableDepartments === undefined ||
              createUserStore.loading
            }
            error={
              createUserStore.validate &&
              createUserStore.departmentId === undefined
            }
            placeholder={
              createUserStore.availableDepartments
                ? Localization.operationsValue(
                    "Departments_Create_ChooseParentDepartment"
                  )
                : Localization.sharedValue("General_Loading")
            }
            options={this.departmentsOptions()}
            value={createUserStore.departmentId}
            onSelect={option => {
              if (option) {
                createUserStore.departmentId = option.value;
              } else {
                createUserStore.departmentId = undefined;
              }
            }}
          />
          <Select
            size={"medium"}
            headline={Localization.sharedValue("Users_Create_Role:Headline")}
            className="c-userManagement-roles"
            disabled={
              createUserStore.availableRoles === undefined ||
              createUserStore.loading
            }
            error={
              createUserStore.validate && createUserStore.roleId === undefined
            }
            placeholder={
              createUserStore.availableRoles
                ? Localization.sharedValue("Users_Create_Role:Placeholder")
                : Localization.sharedValue("General_Loading")
            }
            options={this.rolesOptions()}
            value={createUserStore.roleId}
            onSelect={option => {
              if (option) {
                createUserStore.roleId = option.value;
              } else {
                createUserStore.roleId = undefined;
              }
            }}
          />
          <Input
            headline={Localization.operationsValue("Users_Create_FirstName")}
            onChange={value => (createUserStore.firstName = value)}
            value={createUserStore.firstName}
            size={"medium"}
            className="c-users-create-input"
            onEnter={() => this.createUser()}
            error={
              createUserStore.validate &&
              createUserStore.firstName === undefined
            }
          />
          <Input
            headline={Localization.operationsValue("Users_Create_LastName")}
            onChange={value => (createUserStore.lastName = value)}
            value={createUserStore.lastName}
            size={"medium"}
            className="c-users-create-input"
            onEnter={() => this.createUser()}
            error={
              createUserStore.validate && createUserStore.lastName === undefined
            }
          />
          <Input
            headline={Localization.operationsValue("Users_Create_Email")}
            onChange={value => (createUserStore.email = value)}
            value={createUserStore.email}
            size={"medium"}
            className="c-users-create-input"
            type={"email"}
            onEnter={() => this.createUser()}
            error={
              createUserStore.validate &&
              (createUserStore.email === undefined ||
                Validation.email(createUserStore.email) === false)
            }
          />

        </PageContentComponent>

        {createUserStore.error && (
          <Toast
            remove={() => (createUserStore.error = undefined)}
            type={ToastType.Alert}
          >
            {createUserStore.error}
          </Toast>
        )}

        {createUserStore.createdUser && (
          <Toast
            remove={() => (createUserStore.createdUser = undefined)}
            type={ToastType.Success}
          >
            {Localization.operationsValue("Users_Create_Created").replace(
              "{user}",
              createUserStore.createdUser
            )}
          </Toast>
        )}

      </>
    );
  }
}
