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

interface Props {
  store: RoutePlanningSettingsStore;
}

interface State {
  startDate?: DateTime;
  endDate?: DateTime;
  days?: number[];
  additionalLoadingTime?: number;
  additionalTraffic?: number;
  isBlocked: boolean;
  validationFailed: boolean;
}

@observer
export default class AreaPropertiesComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBlocked: false,
      validationFailed: false
    };
  }

  validate() {
    let validationFailed = false;

    if (!this.state.days) {
      validationFailed = true;
    }

    if (
      (this.state.startDate || this.state.endDate) &&
      (!this.state.startDate || !this.state.endDate)
    ) {
      validationFailed = true;
    }

    if (
      this.state.isBlocked === false &&
      !this.state.additionalLoadingTime &&
      !this.state.additionalTraffic
    ) {
      validationFailed = true;
    }

    if (validationFailed) {
      this.setState({ validationFailed });
    } else {
      this.create();
    }
  }

  create() {
    let area = new SpecialCondition();

    area.startDate = this.state.startDate;
    area.endDate = this.state.endDate;
    area.days = this.state.days!;
    if (this.state.isBlocked) {
      area.isBlocked = this.state.isBlocked;
      area.additionalTrafficPercentage = 0.5;
      area.additionalLoadingTime = 1;
    } else {
      if (this.state.additionalTraffic) {
        area.additionalTrafficPercentage = this.state.additionalTraffic / 100;
      }

      area.additionalLoadingTime = this.state.additionalLoadingTime;
    }

    this.props.store.addCondition(area);
  }

  formatWeekdays(): OptionValue[] | undefined {
    if (!this.state.days) {
      return undefined;
    }

    let days = Localization.weekdaysFromIds(this.state.days);

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
                this.setState({ days: days });
              } else {
                this.setState({ days: undefined });
              }
            }}
            error={this.state.validationFailed && !this.state.days}
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
                this.setState({ startDate: date });
              }}
              date={this.state.startDate}
              error={
                this.state.validationFailed &&
                this.state.startDate === undefined &&
                this.state.endDate !== undefined
              }
              minimum={DateTime.local()}
            />
            <DateComponent
              size="medium"
              headline="TIL DATO"
              placeholder="Vælg til"
              onChange={date => {
                this.setState({ endDate: date });
              }}
              date={this.state.endDate}
              error={
                this.state.validationFailed &&
                this.state.endDate === undefined &&
                this.state.startDate !== undefined
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
              this.setState({
                additionalLoadingTime: additionalLoadingTime
              });
            }}
            maxlength={6}
            value={this.state.additionalLoadingTime}
            error={
              this.state.validationFailed &&
              this.state.isBlocked === false &&
              !this.state.additionalLoadingTime &&
              !this.state.additionalTraffic
            }
            disabled={this.state.isBlocked}
          />
          <InputNumbers
            size={"medium"}
            headline="EKSTRA KØRETID"
            valueDescription="%"
            placeholder="Skriv procent"
            onChange={value => {
              if (value) {
                this.setState({
                  additionalTraffic: value
                });
              }
            }}
            value={this.state.additionalTraffic}
            maxlength={3}
            error={
              this.state.validationFailed &&
              this.state.isBlocked === false &&
              !this.state.additionalLoadingTime &&
              !this.state.additionalTraffic
            }
            disabled={this.state.isBlocked}
          />
          <InputCheckbox
            error={
              this.state.validationFailed &&
              this.state.isBlocked === false &&
              !this.state.additionalLoadingTime &&
              !this.state.additionalTraffic
            }
            onChange={blocked => this.setState({ isBlocked: blocked })}
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
            Opret område med indstilling
          </Button>
        </div>
      </div>
    );
  }
}
