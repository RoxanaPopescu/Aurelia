import React from "react";
import "./styles.scss";
import Moment from "moment";
import "moment/locale/da";
import Kronos from "react-kronos";
import { InputSize } from "../../input";

export interface DateTimeRangeProps {
  className?: string;
  date?: Moment.Moment;
  startTime?: Moment.Moment;
  endTime?: Moment.Moment;
  size?: InputSize;
  placeholder?: string;
  intervalInMinutes?: number;
  minDate?: Moment.Moment;
  maxDate?: Moment.Moment;
  disabled?: boolean;
  error?: boolean;
  onChange(startTime?: Moment.Moment, endTime?: Moment.Moment);
}

export interface DateTimeRangeState {
  date: Moment.Moment;
  startTime?: Moment.Moment;
  endTime?: Moment.Moment;
  error?: boolean;
}

export default class DateTimeRangeComponent extends React.Component<
  DateTimeRangeProps,
  DateTimeRangeState
> {
  defaultInterval = 15;
  constructor(props: DateTimeRangeProps) {
    super(props);

    this.state = {
      date: props.date === undefined ? Moment() : props.date,
      startTime: props.startTime,
      endTime: props.endTime,
      error: props.error
    };
  }

  componentWillReceiveProps(nextProps: DateTimeRangeProps) {
    this.setState({
      date: nextProps.date === undefined ? Moment() : nextProps.date,
      error: nextProps.error
    });
  }

  onChangeDate(
    date: Moment.Moment,
    startTime?: Moment.Moment,
    endTime?: Moment.Moment
  ) {
    this.props.onChange(
      startTime
        ? date.set({ hours: startTime.hours(), minutes: startTime.minutes() })
        : undefined,
      endTime
        ? date.set({ hours: endTime.hours(), minutes: endTime.minutes() })
        : undefined
    );
  }

  getStartTime() {
    if (this.state.startTime === undefined) {
      return "";
    }

    return this.state.startTime;
  }

  getEndTime() {
    if (this.state.endTime === undefined) {
      return "";
    }

    return this.state.endTime;
  }

  getInterval() {
    if (this.props.intervalInMinutes === undefined) {
      return this.defaultInterval;
    } else {
      return this.props.intervalInMinutes;
    }
  }

  getStartMinTime() {
    if (this.state.date.isSame(Moment(), "day")) {
      return Moment();
    } else {
      return Moment().startOf("date");
    }
  }

  getStartMaxTime() {
    if (this.state.endTime !== undefined) {
      return this.state.endTime.clone().subtract(this.getInterval(), "minutes");
    } else {
      return undefined;
    }
  }

  getEndMinTime() {
    if (this.state.date.isSame(Moment(), "day")) {
      if (this.state.startTime !== undefined) {
        if (this.state.startTime.isAfter(Moment())) {
          return this.state.startTime
            .clone()
            .add(this.getInterval(), "minutes");
        }
      }

      return Moment().add(this.getInterval(), "minutes");
    } else {
      return Moment().startOf("date");
    }
  }

  getContainerClassNames() {
    let containerClassnames = "dateTimeRangeWrapper";
    if (this.props.className) {
      containerClassnames += " " + this.props.className;
    }

    switch (this.props.size) {
      case "medium":
        containerClassnames += " inputMedium inputDefault";
        break;
      case "large":
        containerClassnames += " inputLarge font-base";
        break;
      // InputSizes.Small and undefined defaults to this
      default:
        containerClassnames += " inputSmall list1";
        break;
    }

    if (this.state.error === true) {
      containerClassnames += " error";
    }

    return containerClassnames;
  }

  getInputClassName() {
    var className: string = "dateTimeInput";

    switch (this.props.size) {
      case "medium":
        className += " inputDefault";
        break;
      case "large":
        className += " font-base";
        break;
      // InputSizes.Small and undefined defaults to this
      default:
        className += " list1";
        break;
    }

    return className;
  }

  render() {
    return (
      <div className={this.getContainerClassNames()}>
        <div
          className={
            "middleWrapper dateWrapper" +
            (this.props.disabled ? " disabled" : "")
          }
        >
          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            disabled={this.props.disabled}
            date={this.state.date}
            format="DD. MMMM YYYY"
            placeholder={this.props.placeholder ? this.props.placeholder : ""}
            calendarClassName="dateCalendar"
            inputClassName={"dateTimeInput"}
            returnAs={"MOMENT"}
            options={{
              locale: {
                lang: "da",
                settings: {
                  week: { dow: 1 },
                  weekdaysMin: ["MAN", "TIR", "ONS", "TOR", "FRE", "LØR", "SØN"]
                }
              }
            }}
            max={this.props.maxDate ? this.props.maxDate : Moment().add(6, "M")}
            min={
              this.props.minDate ? this.props.minDate : Moment().startOf("date")
            }
            onChangeDateTime={value => {
              this.setState({
                date: value
              });
              this.onChangeDate(
                value,
                this.state.startTime,
                this.state.endTime
              );
            }}
          />
          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            disabled={this.props.disabled}
            time={this.getStartTime()}
            timeStep={this.getInterval()}
            format="HH:mm"
            placeholder={this.props.placeholder ? this.props.placeholder : ""}
            calendarClassName="timeCalendar"
            inputClassName={"dateTimeInput"}
            returnAs={"MOMENT"}
            minTime={this.getStartMinTime()}
            maxTime={this.getStartMaxTime()}
            onChangeDateTime={value => {
              this.setState({
                startTime: value
              });
              this.onChangeDate(this.state.date, value, this.state.endTime);
            }}
          />
          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            disabled={this.props.disabled}
            time={this.getEndTime()}
            timeStep={this.getInterval()}
            format="HH:mm"
            placeholder={this.props.placeholder ? this.props.placeholder : ""}
            calendarClassName="timeCalendar"
            inputClassName={"dateTimeInput"}
            returnAs={"MOMENT"}
            minTime={this.getEndMinTime()}
            onChangeDateTime={value => {
              this.setState({
                endTime: value
              });
              this.onChangeDate(this.state.date, this.state.startTime, value);
            }}
          />
        </div>
      </div>
    );
  }
}
