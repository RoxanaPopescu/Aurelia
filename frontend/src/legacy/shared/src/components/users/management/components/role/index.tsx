import React from "react";
import "./styles.scss";
import {
  Toast,
  ToastType,
  MultiSelect,
  Button,
  ButtonType,
  Input
} from "shared/src/webKit";
import { observer } from "mobx-react";
import { SelectOptionValue } from "shared/src/webKit/select";
import { Role, ClaimGroup } from "../../../../../model/profile/user";
import { RoleStore } from "./store";
import UserManagementService from "../../../service";
import { ButtonSize } from "shared/src/webKit/button";

export const roleStore = new RoleStore();

interface Props {
  role?: Role;
}

@observer
export default class RoleComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (!roleStore.availableClaimGroups) {
      roleStore.error = undefined;
      roleStore.loading = true;

      UserManagementService.getClaimGroups()
        .then(claimGroups => {
          roleStore.availableClaimGroups = claimGroups;

          if (this.props.role) {
            this.getRole(this.props.role.id);
          } else {
            roleStore.loading = false;
          }
        })
        .catch(error => {
          roleStore.error = error.message;

          roleStore.loading = false;
        });
    } else if (this.props.role) {
      this.getRole(this.props.role.id);
    }
  }

  private getRole(roleId: string) {
    roleStore.error = undefined;
    roleStore.loading = true;

    UserManagementService.getRole(roleId)
      .then(role => {
        roleStore.roleId = role.id;
        roleStore.roleName = role.name;
        roleStore.chosenClaimGroups = role.claimGroups;

        roleStore.loading = false;
      })
      .catch(error => {
        roleStore.error = error.message;
        roleStore.loading = false;
      });
  }

  private createRole() {
    roleStore.validate = true;
    if (
      roleStore.roleName === undefined ||
      roleStore.chosenClaimGroups === undefined
    ) {
      return;
    }
    roleStore.error = undefined;
    roleStore.loading = true;
    roleStore.validate = false;

    UserManagementService.createRole(
      roleStore.roleName,
      roleStore.chosenClaimGroups
    )
      .then(() => {
        roleStore.loading = false;
        roleStore.modalOpen = false;
        roleStore.success = `"${roleStore.roleName}" er blevet oprettet`;

        roleStore.roleName = undefined;
        roleStore.chosenClaimGroups = undefined;
        roleStore.modalOpen = false;
      })
      .catch(error => {
        roleStore.loading = false;
        roleStore.error = error.message;
      });
  }

  private updateRole() {
    roleStore.validate = true;
    if (
      roleStore.roleId === undefined ||
      roleStore.roleName === undefined ||
      roleStore.chosenClaimGroups === undefined
    ) {
      return;
    }
    roleStore.error = undefined;
    roleStore.loading = true;
    roleStore.validate = false;

    UserManagementService.updateRole(
      roleStore.roleId,
      roleStore.roleName,
      roleStore.chosenClaimGroups
    )
      .then(() => {
        roleStore.loading = false;
        roleStore.modalOpen = false;
        roleStore.success = `"${roleStore.roleName}" er blevet opdateret`;

        roleStore.roleName = undefined;
        roleStore.chosenClaimGroups = undefined;
        roleStore.modalOpen = false;
      })
      .catch(error => {
        roleStore.loading = false;
        roleStore.error = error.message;
      });
  }

  private claimGroupsOptions(): SelectOptionValue[] {
    if (!roleStore.availableClaimGroups) {
      return [];
    }

    let options: SelectOptionValue[] = roleStore.availableClaimGroups.map(
      group => {
        return { label: group.name, value: group.id };
      }
    );

    return options;
  }

  render() {
    return (
      <div className="c-role-outerContainer">
        <div
          className="c-role-backdrop"
          onClick={() => (roleStore.modalOpen = false)}
        />
        <div className="c-role">
          <div className="c-role-headline font-large">
            {this.props.role ? "Rediger rolle" : "Opret rolle"}
          </div>
          <div className="c-role-formContainer">
            <Input
              size="medium"
              onChange={value => {
                roleStore.roleName = value;
              }}
              value={roleStore.roleName}
              headline="Navn på rolle"
              disabled={roleStore.loading}
            />
            <MultiSelect
              disabled={roleStore.loading}
              size="medium"
              headline="Tilføj funktionalitet"
              placeholder={
                roleStore.loading ? "Henter data ..." : "Vælg funktionaliteter"
              }
              onChange={options => {
                if (options) {
                  roleStore.chosenClaimGroups = options.map(option => {
                    return new ClaimGroup({
                      groupName: option.label,
                      groupId: option.value
                    });
                  });
                } else {
                  roleStore.chosenClaimGroups = undefined;
                }
              }}
              error={false}
              options={this.claimGroupsOptions()}
              values={
                roleStore.chosenClaimGroups
                  ? roleStore.chosenClaimGroups.map(group => {
                      return { label: group.name, value: group.id };
                    })
                  : undefined
              }
            />
            <Button
              type={ButtonType.Action}
              size={ButtonSize.Medium}
              onClick={() => {
                if (this.props.role) {
                  this.updateRole();
                } else {
                  this.createRole();
                }
              }}
              loading={roleStore.loading}
            >
              {this.props.role ? "Opdater" : "Opret"}
            </Button>
          </div>
        </div>
        {roleStore.error && (
          <Toast
            remove={() => (roleStore.error = undefined)}
            type={ToastType.Alert}
          >
            {roleStore.error}
          </Toast>
        )}
      </div>
    );
  }
}
