import React from "react";
import { observer } from "mobx-react";
import { Input } from "shared/src/webKit";
import { Driver } from "../../../../models/driver";
import Localization from "shared/src/localization";

export interface DriverFormProps {
  driver: Driver;
  validate: boolean;
}

@observer
export class DriverForm extends React.Component<DriverFormProps> {

  public render() {
    return (
      <div className="c-driver-form c-driver-driverForm">
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Profile_FirstName")}
          placeholder={Localization.operationsValue("Driver_Profile_FirstName")}
          onChange={value => (this.props.driver.name.first = value)}
          error={this.props.validate && this.props.driver.name.first === undefined}
          value={this.props.driver.name.first}
        />
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Profile_LastName")}
          placeholder={Localization.operationsValue("Driver_Profile_LastName")}
          onChange={value => (this.props.driver.name.last = value)}
          error={this.props.validate && this.props.driver.name.last === undefined}
          value={this.props.driver.name.last}
        />
        <Input
          size={"medium"}
          type="email"
          headline={Localization.operationsValue("Driver_Profile_Email")}
          placeholder={Localization.operationsValue("Driver_Profile_Email")}
          onChange={value => (this.props.driver.email = value)}
          error={this.props.validate &&
            (this.props.driver.email === undefined || !/^[^@]+@[^@]+\.[^@]+$/.test(this.props.driver.email))}
          value={this.props.driver.email}
        />
        <div>
          <Input
            size={"medium"}
            type="tel"
            headline={Localization.operationsValue("Driver_Profile_Phone")}
            placeholder={Localization.operationsValue("Driver_Profile_Phone")}
            onChange={value => (this.props.driver.phone.number = value)}
            error={this.props.validate && !this.props.driver.phone.isValid}
            value={this.props.driver.phone.number}
          />
        </div>
      </div>
    );
  }
}