import React from "react";
import { observer } from "mobx-react";
import { Input, Select } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { AutoDispatchRule } from "../../services/autoDispatchService";
import MultiSelectComponent from "shared/src/webKit/select/multiSelect";
import { OrganizationConnection } from "app/model/organization";

export interface EditRuleFormProps {
  rule: AutoDispatchRule;
  fulfillers: OrganizationConnection[];
  validate: boolean;
}

@observer
export class EditRuleForm extends React.Component<EditRuleFormProps> {

  public render() {
    return (
      <div className="c-autoDispatch-form c-autoDispatch-ruleForm">
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Routes_AutoDispatch_Rule_Name")}
          placeholder={Localization.operationsValue("Routes_AutoDispatch_Rule_Name")}
          onChange={value => this.props.rule.label = value}
          error={this.props.validate && this.props.rule.label === undefined}
          value={this.props.rule.label}
        />
        <Input
          type="number"
          size={"medium"}
          headline={Localization.operationsValue("Routes_AutoDispatch_Rule_Priority")}
          placeholder={Localization.operationsValue("Routes_AutoDispatch_Rule_Priority")}
          onChange={value => this.props.rule.priority = parseInt(value, 10)}
          error={this.props.validate && (isNaN(this.props.rule.priority) || this.props.rule.priority < 0)}
          value={this.props.rule.priority.toString()}
        />
        <MultiSelectComponent
          placeholder="Matcher alle rute tags"
          size={"medium"}
          addOptionText="Tilføj tag"
          headline="Matcher alle rute tags"
          values={
            this.props.rule.routeTagsAllRequired.map(tag =>
              ({ label: tag, value: tag })
            )}
          onChange={values => {
            if (values) {
              this.props.rule.routeTagsAllRequired = values.map(value => value.value);
            } else {
              this.props.rule.routeTagsAllRequired = [];
            }
          }}
        />
        <MultiSelectComponent
          placeholder="Matcher et rute tag"
          size={"medium"}
          addOptionText="Tilføj tag"
          headline="Matcher et rute tag"
          values={
            this.props.rule.routeTagsOneRequired.map(tag =>
              ({ label: tag, value: tag })
            )}
          onChange={values => {
            if (values) {
              this.props.rule.routeTagsOneRequired = values.map(value => value.value);
            } else {
              this.props.rule.routeTagsOneRequired = [];
            }
          }}
        />
        <Select
          headline={"Organization"}
          placeholder={"Organization"}
          options={(this.props.fulfillers?.map(f => ({ label: f.organization.name, value: f.organization.id }))) ?? []}
          size={"medium"}
          onSelect={option => {
            this.props.rule.fulfillerId = option ? option.value : undefined;
          }}
          error={this.props.validate && !this.props.rule.fulfillerId}
          value={this.props.rule.fulfillerId}
        />
      </div>
    );
  }
}
