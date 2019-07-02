import React from "react";
import "./styles.scss";
import Moment from "moment";
import { InputSize } from "../../input";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import "./datePickerCssFix.scss";
import ReactDOM from "react-dom";

interface Props {
  className?: string;
  date?: DateTime;
  size?: InputSize;
  placeholder?: string;
  headline?: string;
  inlineHeadline?: boolean;
  minimum?: DateTime;
  maximum?: DateTime;
  disabled?: boolean;
  error: boolean;
  onChange(date: DateTime);
}

interface State {
  date?: Moment.Moment;
  error: boolean;
}

export default class DateComponent extends React.Component<Props, State> {
  static defaultProps = {
    error: false
  };

  constructor(props: Props) {
    super(props);

    let date: Moment.Moment | undefined;
    if (props.date) {
      date = Moment(props.date.toString());
    }

    this.state = {
      date: date,
      error: props.error
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let date: Moment.Moment | undefined;
    if (nextProps.date) {
      date = Moment(nextProps.date.toString());
    }

    this.setState({
      date: date,
      error: nextProps.error
    });
  }

  onChangeDate(value: Moment.Moment) {
    this.setState({
      date: value
    });

    let date = DateTime.fromISO(value.format()).setZone("UTC", {
      keepLocalTime: true
    });
    this.props.onChange(date);
  }

  getContainerClassNames() {
    let containerClassnames = "dateWrapper";
    if (this.props.className) {
      containerClassnames += " " + this.props.className;
    }

    switch (this.props.size) {
      case "medium":
        containerClassnames += " inputMedium";
        break;
      case "large":
        containerClassnames += " inputLarge";
        break;
      // InputSizes.Small and undefined defaults to this
      default:
        containerClassnames += " inputSmall";
        break;
    }

    if (this.props.headline) {
      if (this.props.inlineHeadline) {
        containerClassnames += " inlineHeadline";
      } else {
        containerClassnames += " headline";
      }
    }

    if (this.state.error) {
      containerClassnames += " error";
    }

    return containerClassnames;
  }

  render() {
    // HACK: We don't handle an empty input correctly, so for now, just disable editing.
    setTimeout(() => {
      try {
        const element = ReactDOM.findDOMNode(this) as HTMLElement | null;
        if (element != null) {
          const inputElement = element.getElementsByTagName(
            "input"
          )[0] as HTMLInputElement | null;
          if (inputElement != null) {
            inputElement.readOnly = true;
          }
        }
      } catch (error) {
        // Ignore random errors caused by react being a piece of shit.
      }
    }, 100);
    return (
      <div className={this.getContainerClassNames()}>
        <div
          className={"middleWrapper" + (this.props.disabled ? " disabled" : "")}
        >
          {this.props.headline && (
            <div className="inputHeadline font-heading">
              {this.props.headline}
            </div>
          )}
          <DatePicker
            onChangeRaw={e => e.preventDefault()} // EXTRA HACK, in case the above hack fails.
            className="dateTimeInput"
            selected={this.state.date}
            onChange={date => this.onChangeDate(date)}
            placeholderText={this.props.placeholder}
            minDate={
              this.props.minimum
                ? Moment(this.props.minimum.toString())
                : undefined
            }
            maxDate={
              this.props.maximum
                ? Moment(this.props.maximum.toString())
                : undefined
            }
          />
        </div>
      </div>
    );
  }
}

/*

          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            disabled={this.props.disabled}
            date={this.state.date}
            format="DD. MMMM YYYY"
            placeholder={this.props.placeholder ? this.props.placeholder : ""}
            calendarClassName="dateTimeCalendar"
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
            max={this.props.maximum ? this.props.maximum : Moment().add(6, "M")}
            min={
              this.props.minimum ? this.props.minimum : Moment().startOf("date")
            }
            onChangeDateTime={value => {
              this.onChangeDate(value);
            }}
          />
*/
