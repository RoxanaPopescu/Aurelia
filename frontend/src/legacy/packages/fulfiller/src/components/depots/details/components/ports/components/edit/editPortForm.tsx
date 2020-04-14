import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { Button, ButtonType, ButtonSize } from "shared/src/webKit/button/index";
import { InputNumbers, MultiSelect } from "shared/src/webKit";
import Localization from "shared/src/localization";
import TimeComponent from "shared/src/webKit/date/time";
import { Availability } from "shared/src/model/logistics/depots";
import { OptionValue } from "react-selectize";
import { observable } from "mobx";
import { DepotStore } from "../../../../store";

interface Props {
  store: DepotStore;
}

@observer
export default class DepotPortsEditComponent extends React.Component<Props> {
  @observable validate = false;
  availability: Availability;

  constructor(props: Props) {
    super(props);
    this.availability = this.props.store.activeGate!;
  }

  formatWeekdays(): OptionValue[] | undefined {
    if (!this.availability.daysOfWeek) {
      return undefined;
    }

    let weekdays = Localization.weekdaysFromIds(this.availability.daysOfWeek);

    return weekdays.map(weekday => {
      return { label: weekday.short, value: weekday.number };
    });
  }

  validateInput() {
    if (
      !this.availability.openingTime ||
      !this.availability.closingTime ||
      !this.availability.daysOfWeek ||
      !this.availability.numberOfGates
    ) {
      this.validate = true;
      return;
    }

    if (this.availability.closingTime <= this.availability.openingTime) {
      this.validate = true;
      return;
    }

    if (this.availability.created === false) {
      this.props.store.depot.availabilities.push(this.availability);
    }

    this.props.store.updateDepot();
  }

  render() {
    return (
      <div className="c-portForm-container">
        <MultiSelect
          size={"medium"}
          headline={Localization.operationsValue("Depots_Gates_Update_WeekDays")}
          onChange={values => {
            if (values) {
              this.availability.daysOfWeek = values.map(object => object.value);
            } else {
              this.availability.daysOfWeek = undefined;
            }
          }}
          options={Localization.allWeekdays.map(weekday => {
            return { label: weekday.short, value: weekday.number };
          })}
          error={this.validate && !this.availability.daysOfWeek}
          values={this.formatWeekdays()}
        />
        <InputNumbers
          size={"medium"}
          headline={Localization.operationsValue("Depots_Gates_Update_NumberOfGates")}
          valueDescription={Localization.operationsValue("Depots_Gates_Update_WeekDays:Input")}
          onChange={numberOfPorts => {
            this.availability.numberOfGates = numberOfPorts;
          }}
          error={this.validate && !this.availability.numberOfGates}
          value={this.availability.numberOfGates}
        />
        <TimeComponent
          headline={Localization.operationsValue("Depots_Gates_Update_TimeStart")}
          placeholder="TT:MM"
          size={"medium"}
          onChange={seconds => {
            this.availability.openingTime = seconds;
          }}
          seconds={this.availability.openingTime}
          error={this.validate && !this.availability.openingTime}
          disabled={false}
        />
        {this.renderClosingTime()}
        <Button
          size={ButtonSize.Medium}
          onClick={() => this.validateInput()}
          type={ButtonType.Action}
          loading={this.props.store.saving}
        >
          {this.availability.created ? Localization.operationsValue("Depots_General_Update:Button") : Localization.operationsValue("Depots_General_Create:Button")}
        </Button>
      </div>
    );
  }

  renderClosingTime(): JSX.Element {
    let error = false;
    if (this.validate) {
      if (!this.availability.closingTime) {
        error = true;
      } else if (this.availability.openingTime && this.availability.closingTime <= this.availability.openingTime) {
        error = true;
      }
    }

    return (
      <TimeComponent
          headline={Localization.operationsValue("Depots_Gates_Update_TimeEnd")}
          placeholder="TT:MM"
          size={"medium"}
          onChange={seconds => {
            this.availability.closingTime = seconds;
          }}
          seconds={this.availability.closingTime}
          error={error}
          disabled={false}
        />
    );
  }
}
