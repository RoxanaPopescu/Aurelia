import React from "react";
import H from "history";
import "./styles.scss";
import { DepartmentStore } from "./store";
import { Input, Toast, ToastType, Select } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { ButtonType, Button, ButtonSize } from "shared/src/webKit/button/index";
import { observer } from "mobx-react";
import { SelectOptionValue } from "../../../webKit/select";
import DepartmentsService from "../service";
import { Session } from "../../../model/session/session";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";
import { SubPage } from "shared/src/utillity/page";
import { Profile } from "shared/src/model/profile";

const departmentStore = new DepartmentStore();

interface Props {
  parentId: string;
  id: string;
  history?: H.History;
}

@observer
export default class DepartmentComponent extends React.Component<Props> {
  id: string | undefined;

  constructor(props: Props) {
    super(props);

    if (this.props.id == null || this.props.id === "create")
    {
      this.id = undefined;
    }
    else
    {
      this.id = this.props.id;
    }

    document.title = this.id != null
      ? Localization.operationsValue("Departments_Update_Title").replace("{department}", this.id)
      : Localization.operationsValue("Departments_Create_Title");
  }

  componentDidMount() {
    this.startUp();
  }
  private startUp() {
    departmentStore.reset();
    departmentStore.departmentPublicId = this.id

    if (departmentStore.departmentPublicId == "create")
    {
      departmentStore.departmentPublicId = undefined;
    }

    if (departmentStore.departmentPublicId) {
      departmentStore.loading = true;

      DepartmentsService.details(departmentStore.departmentPublicId)
        .then(outfit => {
          departmentStore.loading = false;
          departmentStore.departmentId = outfit.id;
          departmentStore.departmentName = outfit.companyName;
          departmentStore.departmentPublicId = outfit.publicId;
        })
        .catch(error => {
          departmentStore.error = error.message;
          departmentStore.loading = false;
        });
    }

    DepartmentsService.list()
    .then(outfits => {
      departmentStore.departments = outfits;
    })
    .catch(error => {
      // Do nothing
    });
  }

  private createDepartment() {
    departmentStore.error = undefined;
    departmentStore.validate = true;

    if (
      departmentStore.departmentPublicId === undefined ||
      departmentStore.departmentName === undefined ||
      departmentStore.departmentParentId === undefined
    ) {
      return;
    }

    departmentStore.loading = true;

    try {
      DepartmentsService.create(
        departmentStore.departmentName,
        departmentStore.departmentPublicId,
        departmentStore.departmentParentId
      );

      departmentStore.success = Localization.operationsValue("Departments_Create_Confirmation").replace("{department}", departmentStore.departmentName);
      departmentStore.reset();
    } catch (error) {
      departmentStore.error = error.message;
    }

    departmentStore.loading = false;
  }

  private updateDepartment() {
    departmentStore.error = undefined;
    departmentStore.validate = true;

    if (
      departmentStore.departmentId === undefined ||
      departmentStore.departmentPublicId === undefined ||
      departmentStore.departmentName === undefined
    ) {
      return;
    }

    departmentStore.loading = true;

    DepartmentsService.update(
      departmentStore.departmentId,
      departmentStore.departmentName
    )
      .then(() => {
        departmentStore.loading = false;
        departmentStore.success = Localization.operationsValue("Departments_Update_Confirmation")
          .replace("{department}", departmentStore.departmentName != null ? departmentStore.departmentName : "");
      })
      .catch(error => {
        departmentStore.loading = false;
        departmentStore.error = error.message;
      });
  }

  private getParentOptions(): SelectOptionValue[] {
    if (!departmentStore.departments) {
      return [];
    }

    let options: SelectOptionValue[] = [
      {
        label: Session.outfit.primaryName,
        value: Session.outfit.id
      }
    ];

    let departmentOptions: SelectOptionValue[] = departmentStore.departments.map(
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
            { title: Localization.operationsValue("Menu_Departments"), href: SubPage.path(SubPage.DepartmentsList) },
            { title: this.id != null ? Localization.operationsValue("Departments_Update_Title").replace("{department}", this.id) : Localization.operationsValue("Departments_Create_Title") }
          ]}
        >

          {Profile.claims.has("create-departments") &&
          <Button
            type={ButtonType.Action}
            size={ButtonSize.Medium}
            onClick={() =>
              this.id != null
                ? this.updateDepartment()
                : this.createDepartment()
            }
            disabled={
              (departmentStore.departmentName == null || departmentStore.departmentPublicId == null) || (departmentStore.departmentParentId == null && departmentStore.departmentId == null)
            }
            loading={departmentStore.loading}
          >
            {this.id != null
              ? Localization.operationsValue("Departments_Update:Button")
              : Localization.consignorValue(
                  "Departments_Create_CreateDepartment"
                )}
          </Button>}

        </PageHeaderComponent>

        <PageContentComponent className="c-departments-create">

          <Input
            className="c-departments-input"
            size={"medium"}
            headline={Localization.operationsValue(
              "Departments_Create_CompanyName"
            )}
            value={departmentStore.departmentName}
            onEnter={() => this.updateDepartment()}
            onChange={value => (departmentStore.departmentName = value)}
            disabled={departmentStore.loading}
            error={
              departmentStore.validate &&
              departmentStore.departmentName === undefined
            }
            readonly={!Profile.claims.has("create-departments")}
          />
          <Input
            className="c-departments-input"
            size={"medium"}
            headline={Localization.operationsValue(
              "Departments_Create_PublicID"
            )}
            readonly={!!departmentStore.departmentId}
            value={departmentStore.departmentPublicId}
            onEnter={() => this.updateDepartment()}
            onChange={value => (departmentStore.departmentPublicId = value)}
            disabled={departmentStore.loading}
            error={
              departmentStore.validate &&
              departmentStore.departmentPublicId === undefined
            }
          />
          {this.id === undefined && (
            <Select
              size={"medium"}
              headline={Localization.operationsValue(
                "Departments_Create_ParentId"
              )}
              readonly={!!departmentStore.departmentId}
              className="c-departments-input"
              disabled={
                departmentStore.departments === undefined ||
                departmentStore.loading
              }
              error={
                departmentStore.validate &&
                departmentStore.departmentParentId === undefined
              }
              placeholder={
                departmentStore.departments
                  ? Localization.operationsValue(
                      "Departments_Create_ChooseParentDepartment"
                    )
                  : Localization.sharedValue("General_Loading")
              }
              value={departmentStore.departmentParentId}
              options={this.getParentOptions()}
              onSelect={option => {
                if (option) {
                  departmentStore.departmentParentId = option.value;
                } else {
                  departmentStore.departmentParentId = undefined;
                }
              }}
            />
          )}

        </PageContentComponent>

        {departmentStore.error && (
          <Toast
            remove={() => (departmentStore.error = undefined)}
            type={ToastType.Alert}
          >
            {departmentStore.error}
          </Toast>
        )}

        {departmentStore.success && (
          <Toast
            remove={() => (departmentStore.success = undefined)}
            type={ToastType.Success}
          >
            {departmentStore.success}
          </Toast>
        )}

        {departmentStore.success && (
          <Toast
            remove={() => (departmentStore.success = undefined)}
            type={ToastType.Success}
          >
            {Localization.operationsValue(
              "Departments_Create_DepartmentCreated"
            )}
          </Toast>
        )}

      </>
    );
  }
}
