import React from "react";
import "./styles.scss";
import "moment/locale/da";
import { InputSize } from "../../input/index";
import DateComponent from "../date";
import TimeComponent from "../time";
import { DateTime } from "luxon";

export interface Props {
  placeholders?: { date: string; time: string };
  value: DateTime;
  headline?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  size?: InputSize;
  onChange?(dateTime: DateTime);
}

export interface State {
  dateTime: DateTime;
}

export default class DateTimeComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dateTime: this.props.value
    };
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      dateTime: props.value ? props.value : this.state.dateTime
    });
  }

  calculateDateTime(date?: DateTime, timeInSeconds?: number) {
    let tempDateTime = this.state.dateTime;
    if (date) {
      tempDateTime = tempDateTime.set({
        day: date.day,
        month: date.month,
        year: date.year
      });
    }

    if (timeInSeconds) {
      tempDateTime = tempDateTime.startOf("day");
      tempDateTime = tempDateTime.plus({ seconds: timeInSeconds });
    }

    tempDateTime = tempDateTime.setZone("UTC", {
      keepLocalTime: true
    });

    this.setState({ dateTime: tempDateTime });

    if (this.props.onChange) {
      this.props.onChange(tempDateTime);
    }
  }

  getClassNames() {
    let classNames = "c-dateTime";

    if (this.props.className) {
      classNames += " " + this.props.className;
    }

    if (this.props.error) {
      classNames += " error";
    }

    if (this.props.disabled) {
      classNames += " disabled";
    }

    return classNames;
  }

  render() {
    return (
      <div className={this.getClassNames()}>
        <DateComponent
          headline={this.props.headline}
          placeholder={
            this.props.placeholders ? this.props.placeholders.date : undefined
          }
          disabled={this.props.disabled}
          size={this.props.size}
          error={this.props.error}
          date={this.state.dateTime}
          onChange={date => {
            this.calculateDateTime(date);
          }}
        />
        <TimeComponent
          size={this.props.size}
          placeholder={
            this.props.placeholders ? this.props.placeholders.time : undefined
          }
          disabled={this.props.disabled}
          seconds={this.state.dateTime
            .diff(this.state.dateTime.startOf("day"))
            .as("seconds")}
          onChange={seconds => {
            this.calculateDateTime(undefined, seconds);
          }}
          error={this.props.error}
        />
      </div>
    );
  }
}
