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
    this.availability = this.props.store.activePort!;
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
      !this.availability.numberOfPorts
    ) {
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
          headline="UGEDAGE"
          placeholder="Vælg ugedage"
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
          headline="Antal porte"
          valueDescription="porte"
          onChange={numberOfPorts => {
            this.availability.numberOfPorts = numberOfPorts;
          }}
          error={this.validate && !this.availability.numberOfPorts}
          value={this.availability.numberOfPorts}
        />
        <TimeComponent
          headline="Åbningstid"
          placeholder="TT:MM"
          size={"medium"}
          onChange={seconds => {
            this.availability.openingTime = seconds;
          }}
          seconds={this.availability.openingTime}
          error={this.validate && !this.availability.openingTime}
          disabled={false}
        />
        <TimeComponent
          headline="Lukketid"
          placeholder="TT:MM"
          size={"medium"}
          onChange={seconds => {
            this.availability.closingTime = seconds;
          }}
          seconds={this.availability.closingTime}
          error={this.validate && !this.availability.closingTime}
          disabled={false}
        />
        <Button
          size={ButtonSize.Medium}
          onClick={() => this.validateInput()}
          type={ButtonType.Action}
          loading={this.props.store.saving}
        >
          {this.availability.created ? "Opdater" : "Opret"}
        </Button>
      </div>
    );
  }
}
