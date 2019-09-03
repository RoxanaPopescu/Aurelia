import React from "react";
import "./styles.scss";
import { RoutePlanningSettingsStore } from "../../../store";
import { observer } from "mobx-react";
import {
  InputNumbers,
  Button,
  ButtonType,
  MultiSelect,
  InputCheckbox
} from "shared/src/webKit";
import { SpecialCondition } from "shared/src/model/logistics/routePlanning/settings";
import { ButtonSize } from "shared/src/webKit/button";
import DividerComponent from "shared/src/webKit/divider";
import DateComponent from "shared/src/webKit/date/date";
import { DateTime } from "luxon";
import Localization from "shared/src/localization";
import { OptionValue } from "react-selectize";
import { observable } from "aurelia-binding";

type SpecialConditionChangeType = "update" | "add";

interface Props {
  store: RoutePlanningSettingsStore;
  updateCondition?: SpecialCondition;
}

@observer
export default class AreaPropertiesComponent extends React.Component<
  Props
> {
  @observable validationFailed = false;
  condition: SpecialCondition;
  type: SpecialConditionChangeType;

  constructor(props: Props) {
    super(props);
    this.state = {
      isBlocked: false,
      validationFailed: false
    };

    if (props.updateCondition) {
      this.condition = Object.assign(new SpecialCondition(), this.props.updateCondition);
      this.type = "update";
    } else {
      this.condition = new SpecialCondition();
      this.type = "add";
    }
  }

  validate() {
    let validationFailed = false;

    if (!this.condition.days || this.condition.days.length <= 0) {
      validationFailed = true;
    }

    if (
      (this.condition.startDate || this.condition.endDate) &&
      (!this.condition.startDate || !this.condition.endDate)
    ) {
      validationFailed = true;
    }

    if (
      this.condition.isBlocked === false &&
      !this.condition.additionalLoadingTime &&
      !this.condition.additionalTrafficPercentage
    ) {
      validationFailed = true;
    }

    if (validationFailed) {
      this.validationFailed = true;
    } else {
      this.create();
    }
  }

  create() {
    if (this.type == "add") {
      this.props.store.addCondition(this.condition);
    } else {
      this.props.store.updateCondition(this.condition);
    }
  }

  formatWeekdays(): OptionValue[] | undefined {
    if (!this.condition.days) {
      return undefined;
    }

    let days = Localization.weekdaysFromIds(this.condition.days);

    return days.map(day => {
      return { label: day.short, value: day.number };
    });
  }

  render() {
    return (
      <div onClick={event => event.stopPropagation()}>
        <div className="c-routePlanSettings-areaSettings-content">
          <div className="font-large margin-bottom">Tilføj tidspunkter</div>
          <MultiSelect
            size={"medium"}
            headline="UGEDAGE"
            placeholder="Vælg"
            onChange={values => {
              if (values) {
                const days = values.map(object => object.value);
                this.condition.days = days;
              } else {
                this.condition.days = [];
              }
            }}
            error={this.validationFailed && !this.condition.days}
            options={Localization.allWeekdays.map(weekday => {
              return { label: weekday.short, value: weekday.number };
            })}
            values={this.formatWeekdays()}
          />

          <div className="c-routePlanSettings-areaSettings-twoInputs">
            <DateComponent
              size="medium"
              headline="FRA DATO"
              placeholder="Vælg fra"
              onChange={date => {
                this.condition.startDate = date;
              }}
              date={this.condition.startDate}
              error={
                this.validationFailed &&
                this.condition.startDate === undefined &&
                this.condition.endDate !== undefined
              }
              minimum={DateTime.local()}
            />
            <DateComponent
              size="medium"
              headline="TIL DATO"
              placeholder="Vælg til"
              onChange={date => {
                this.condition.endDate = date;
              }}
              date={this.condition.endDate}
              error={
                this.validationFailed &&
                this.condition.endDate === undefined &&
                this.condition.startDate !== undefined
              }
              minimum={DateTime.local()}
            />
          </div>

          <DividerComponent />
          <div className="font-large margin-bottom">Tilføj begrænsninger</div>
          <InputNumbers
            size={"medium"}
            headline="EKSTRA LÆSSETID"
            valueDescription="sec"
            placeholder="Skriv sekunder"
            onChange={additionalLoadingTime => {
              this.condition.additionalLoadingTime = additionalLoadingTime;
            }}
            maxlength={6}
            value={this.condition.additionalLoadingTime}
            error={
              this.validationFailed &&
              this.condition.isBlocked === false &&
              !this.condition.additionalLoadingTime &&
              !this.condition.additionalTrafficPercentage
            }
            disabled={this.condition.isBlocked}
          />
          <InputNumbers
            size={"medium"}
            headline="EKSTRA KØRETID"
            valueDescription="%"
            placeholder="Skriv procent"
            onChange={value => {
              if (value) {
                this.condition.additionalTrafficPercentage = value / 100;
              } else {
                this.condition.additionalTrafficPercentage = undefined;
              }
            }}
            value={
              this.condition.additionalTrafficPercentage ?
              Math.round(this.condition.additionalTrafficPercentage * 100) :
              undefined
            }
            maxlength={3}
            error={
              this.validationFailed &&
              this.condition.isBlocked === false &&
              !this.condition.additionalLoadingTime &&
              !this.condition.additionalTrafficPercentage
            }
            disabled={this.condition.isBlocked}
          />
          <InputCheckbox
            error={
              this.validationFailed &&
              this.condition.isBlocked === false &&
              !this.condition.additionalLoadingTime &&
              !this.condition.additionalTrafficPercentage
            }
            onChange={blocked => this.condition.isBlocked = blocked}
            checked={this.condition.isBlocked}
          >
            Blokeret område
          </InputCheckbox>
          <Button
            size={ButtonSize.Medium}
            onClick={() => this.validate()}
            type={ButtonType.Action}
            disabled={this.props.store.saving}
            loading={this.props.store.saving}
          >
            {this.type == "update" ? "Opdater område" : "Opret område med indstilling"}
          </Button>
        </div>
      </div>
    );
  }
}
