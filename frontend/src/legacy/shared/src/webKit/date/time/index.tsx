import React from "react";
import "./index.scss";
import "../date/styles.scss";
import Moment from "moment";
import { InputSize } from "../../input";
import { DateTime, Duration } from "luxon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from "react-dom";

interface Props {
  className?: string;
  seconds?: number;
  size?: InputSize;
  placeholder?: string;
  headline?: string;
  inlineHeadline?: boolean;
  minimum?: DateTime;
  maximum?: DateTime;
  disabled?: boolean;
  interval?: number;
  error: boolean;
  onChange(seconds: number);
}

interface State {
  date?: Moment.Moment;
  error: boolean;
}

export default class TimeComponent extends React.Component<Props, State> {
  static defaultProps = {
    error: false
  };

  constructor(props: Props) {
    super(props);
    let date: Moment.Moment | undefined;
    if (props.seconds) {
      let luxonDate = DateTime.fromObject({})
        .startOf("day")
        .plus(
          Duration.fromObject({
            seconds: props.seconds
          })
        );
      date = Moment(luxonDate.toString());
    }

    this.state = {
      date: date,
      error: props.error
    };
  }

  onChangeDate(value: Moment.Moment) {
    this.setState({
      date: value
    });

    let date = DateTime.fromISO(value.format());
    let difference = date
      .startOf("minute")
      .diff(DateTime.fromObject({}).startOf("day"));
    let seconds = difference.as("seconds");
    this.props.onChange(Math.floor(Math.abs(seconds)));
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
            className="dateTimeInput timeInput"
            selected={this.state.date}
            timeIntervals={this.props.interval ? this.props.interval : 15}
            onChange={date => this.onChangeDate(date)}
            placeholderText={this.props.placeholder}
            showTimeSelect={true}
            use12Hours={false}
            showTimeSelectOnly={true}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            locale="da"
            minDate={
              this.props.minimum
                ? Moment(this.props.minimum.toString())
                : undefined
            }
            timeCaption=""
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
