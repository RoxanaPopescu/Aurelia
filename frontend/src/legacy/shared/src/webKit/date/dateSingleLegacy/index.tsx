import React from "react";
import "./styles.scss";
import Moment from "moment";
import "moment/locale/da";
import Kronos from "react-kronos";
import { InputSize } from "../../input";

export interface DateSingleLegacyProps {
  className?: string;
  date?: Moment.Moment;
  size?: InputSize;
  placeholder?: string;
  headline?: string;
  inlineHeadline?: boolean;
  intervalInMinutes?: number;
  minimum?: Moment.Moment;
  maximum?: Moment.Moment;
  disabled?: boolean;
  error?: boolean;
  onChange(value: Moment.Moment);
}

export interface DateSingleLegacyState {
  date?: Moment.Moment;
  error?: boolean;
}

export default class DateSingleLegacyComponent extends React.Component<
  DateSingleLegacyProps,
  DateSingleLegacyState
> {
  constructor(props: DateSingleLegacyProps) {
    super(props);

    this.state = {
      date: props.date,
      error: props.error
    };
  }

  componentWillReceiveProps(nextProps: DateSingleLegacyProps) {
    this.setState({
      date: nextProps.date,
      error: nextProps.error
    });
  }

  onChangeDate(value: Moment.Moment) {
    this.setState({
      date: value
    });

    this.props.onChange(value.clone());
  }

  getContainerClassNames() {
    let containerClassnames = "dateWrapper";
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
          {this.props.headline && (
            <div className="dateTimeHeadline font-small">
              {this.props.headline}
            </div>
          )}
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
        </div>
      </div>
    );
  }
}
