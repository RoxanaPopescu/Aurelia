import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Select, Input } from "shared/src/webKit";
import { VehicleType } from "shared/src/model/logistics/vehicleType";
import { Vehicle } from "../../../../models/vehicle";
import "./vehicleForm.scss";
import Localization from "shared/src/localization";

export interface VehicleFormProps {
  vehicle: Vehicle;
  validate: boolean;
}

@observer
export class VehicleForm extends React.Component<VehicleFormProps> {

  public constructor(props: VehicleFormProps) {
    super(props);
    
    this.vehicle = props.vehicle;
  }

  public componentWillReceiveProps(nextProps: VehicleFormProps) {
    // If the model is changed, destroy and recreate the view,
    // thus ensuring that all validation states are reset.
    if (nextProps.vehicle !== this.vehicle) {
      this.vehicle = undefined;
      setTimeout(() => this.vehicle = nextProps.vehicle);
    }
  }

  @observable
  private vehicle: Vehicle | undefined;

  public render() {
    if (this.vehicle == null) {
      return <></>;
    }
    return (
      <div className="c-driver-form c-driver-vehicleForm">
        <Select
          headline={Localization.operationsValue("Driver_Vehicles_Type")}
          placeholder={Localization.operationsValue("Driver_Vehicles_Type")}
          options={VehicleType.getAll().map(vt => ({ label: vt.name, value: vt.id }))}
          size={"medium"}
          onSelect={option => {
            this.vehicle!.type = option ? option.value : undefined;
          }}
          error={this.props.validate && !this.vehicle!.type}
          value={this.vehicle!.type}
        />
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Vehicles_LicensePlate")}
          placeholder={Localization.operationsValue("Driver_Vehicles_LicensePlate")}
          onChange={value => (this.vehicle!.licensePlate = value)}
          error={this.props.validate && !this.vehicle!.licensePlate}
          value={this.vehicle!.licensePlate}
        />
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Vehicles_Make")}
          placeholder={Localization.operationsValue("Driver_Vehicles_Make")}
          onChange={value => (this.vehicle!.make = value)}
          error={this.props.validate && !this.vehicle!.make}
          value={this.vehicle!.make}
        />
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Vehicles_Color")}
          placeholder={Localization.operationsValue("Driver_Vehicles_Color")}
          onChange={value => (this.vehicle!.color = value)}
          error={this.props.validate && !this.vehicle!.color}
          value={this.vehicle!.color}
        />
        <Input
          size={"medium"}
          headline={Localization.operationsValue("Driver_Vehicles_Model")}
          placeholder={Localization.operationsValue("Driver_Vehicles_Model")}
          onChange={value => (this.vehicle!.model = value)}
          error={this.props.validate && !this.vehicle!.model}
          value={this.vehicle!.model}
        />
        <Input
          size={"medium"}
          type="number"
          headline={Localization.operationsValue("Driver_Vehicles_Year")}
          placeholder={Localization.operationsValue("Driver_Vehicles_Year")}
          onChange={value => (this.vehicle!.year = parseInt(value, 10))}
          error={
            this.props.validate && (
            !this.vehicle!.year ||
            this.vehicle!.year < new Date(0).getFullYear() ||
            this.vehicle!.year > new Date().getFullYear())
          }
          value={`${this.vehicle!.year}`}
        />
      </div>
    );
  }
}
