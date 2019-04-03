/*
import React from "react";
import "./styles.scss";
import { ButtonType, Button } from "../../button";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import Moment from "moment";

export interface DateRangeProps {
  defaultText: {
    button: string;
    nextMonth: string;
    previousMonth: string;
    startDatePlaceholder: string;
    endDatePlaceholder: string;
  };
  startDate?: Moment.Moment;
  endDate?: Moment.Moment;
  periodChanged(startDate?: Moment.Moment, endDate?: Moment.Moment);
}

export interface DateRangeState {
  startDate?: Moment.Moment;
  endDate?: Moment.Moment;
  open: boolean;
  focusedInput?: string;
}

export default class DateRangeComponent extends React.Component<
  DateRangeProps,
  DateRangeState
> {
  constructor(props: DateRangeProps) {
    super(props);

    this.state = {
      open: false,
      startDate: props.startDate,
      endDate: props.endDate
    };
  }

  componentWillReceiveProps(nextProps: DateRangeProps) {
    this.setState({
      startDate: nextProps.startDate,
      endDate: nextProps.endDate
    });
  }

  toggleDropdown() {
    let newState = !this.state.open;

    this.setState({
      open: newState
    });

    if (newState) {
      this.setState({
        focusedInput: "startDate"
      });
    }
  }

  areDatesChosen() {
    if (this.state.startDate && this.state.endDate) {
      return true;
    } else {
      return false;
    }
  }

  getNavButton(next: boolean) {
    return (
      <div
        className={
          next
            ? "DayPickerNavigation cta4 next"
            : "DayPickerNavigation cta4 previous"
        }
      >
        {next
          ? this.props.defaultText.nextMonth + " ►"
          : "◄ " + this.props.defaultText.previousMonth}
      </div>
    );
  }

  getButtonType() {
    if (this.areDatesChosen()) {
      return ButtonType.Action;
    } else {
      return ButtonType.Neutral;
    }
  }

  getButtonText() {
    if (this.areDatesChosen()) {
      return (
        this.state.startDate!.format("DD-MM-YYYY") +
        " - " +
        this.state.endDate!.format("DD-MM-YYYY")
      );
    } else {
      return this.props.defaultText.button;
    }
  }

  render() {
    return (
      <div className="c-dateRange">
        <Button
          className="c-dateRange-button"
          type={this.getButtonType()}
          onClick={() => this.toggleDropdown()}
        >
          {this.getButtonText()}
        </Button>
        <div
          className={
            this.state.open
              ? "c-dateRange-backdrop"
              : "c-dateRange-backdrop hidden"
          }
          onClick={() => this.toggleDropdown()}
        />
        <div
          className={
            this.state.open
              ? "c-dateRange-dropdown open"
              : "c-dateRange-dropdown"
          }
        >
          <DateRangePicker
            keepOpenOnDateSelect={true}
            readOnly={true}
            noBorder={true}
            customArrowIcon={undefined}
            firstDayOfWeek={0}
            navPrev={this.getNavButton(false)}
            navNext={this.getNavButton(true)}
            startDatePlaceholderText={
              this.props.defaultText.startDatePlaceholder
            }
            endDatePlaceholderText={this.props.defaultText.endDatePlaceholder}
            displayFormat="DD-MM-YYYY"
            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
            startDateId="startDate" // PropTypes.string.isRequired,
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="endDate" // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => {
              this.props.periodChanged(startDate, endDate);

              if (startDate && endDate) {
                this.toggleDropdown();

                // Reset range
                this.setState({ startDate: undefined, endDate: undefined });
              }

              this.setState({ startDate, endDate });
            }} // PropTypes.func.isRequired,
            focusedInput={
              this.state.focusedInput ? this.state.focusedInput : "startDate"
            }
            onFocusChange={focusedInput => {
              if (!focusedInput) {
                return; // doesn't update the focusedInput if it is trying to close the DRP
              }
              this.setState({ focusedInput: focusedInput });
            }}
          />
        </div>
      </div>
    );
  }
}
*/
