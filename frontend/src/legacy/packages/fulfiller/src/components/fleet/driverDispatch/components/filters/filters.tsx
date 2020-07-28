import React from "react";
import "./filters.scss";
import DateComponent from "shared/src/webKit/date/date";
import { InputRadioGroup, Button } from "shared/src/webKit";
import Slider from "./components/slider/slider";
import CheckboxFilter from "./components/checkboxFilter/checkboxFilter";
import { observer } from "mobx-react";
import {
  driverDispatchService,
  DispatchState
} from "../../driverDispatchService";
import { DateTime } from "luxon";
import TimeComponent from "shared/src/webKit/date/time";
import { SelectOptionValue } from "shared/src/webKit/select";
import Localization from '../../../../../../../shared/src/localization/index';
import {
  ButtonType,
  ButtonSize
} from "../../../../../../../shared/src/webKit/button/index";

interface Props {
  page: "forecasts" | "dispatch";
  onStateChange(state: DispatchState);
  onTopFilterChange();
  onFilterChange();
}

interface State {
  startTimeInSeconds?: number;
  endTimeInSeconds?: number;
  duration?: number;
}

@observer
export default class extends React.Component<Props, State> {
  intervalInSeconds = 3600;
  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    var startTimeInSeconds,
      endTimeInSeconds: undefined | number = undefined;
    if (driverDispatchService.startTime) {
      startTimeInSeconds =
        driverDispatchService.startTime.hour * this.intervalInSeconds;
    }
    if (driverDispatchService.startTime) {
      endTimeInSeconds =
        driverDispatchService.endTime.hour * this.intervalInSeconds;
    }

    this.setState({
      startTimeInSeconds: startTimeInSeconds,
      endTimeInSeconds: endTimeInSeconds
    });
  }

  getDurationOptions() {
    let array: SelectOptionValue[] = [];

    for (var i = 1; i <= 24; i++) {
      array.push({
        label: i.toString(),
        value: i,
        labelNote: Localization.operationsValue("Dispatch_Duration")
      });
    }

    return array;
  }

  render() {
    return (
      <div className="c-driverDispatch-filters">
        <Slider headline={Localization.operationsValue("Dispatch_GeneralSettings")}>
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            onClick={() => {
              driverDispatchService.setDefaultValues();
              this.setState({
                startTimeInSeconds: undefined,
                endTimeInSeconds: undefined,
                duration: undefined
              });

              this.props.onTopFilterChange();
            }}
          >
            Reset all
          </Button>
          <div className="c-driverDispatch-filters-datetime">
            <DateComponent
              headline={Localization.operationsValue("Dispatch_DateStart")}
              date={driverDispatchService.startDate}
              onChange={date => {
                var temp = driverDispatchService.startDate.set({
                  year: date.year,
                  month: date.month,
                  day: date.day
                });
                driverDispatchService.startDate = temp.startOf("day");

                if (
                  driverDispatchService.startDate
                    .diff(driverDispatchService.endDate)
                    .valueOf() > 0
                ) {
                  driverDispatchService.endDate =
                    driverDispatchService.startDate.endOf("day");
                }

                this.props.onTopFilterChange();
              }}
            />
            <DateComponent
              headline={Localization.operationsValue("Dispatch_DateEnd")}
              date={driverDispatchService.endDate}
              onChange={date => {
                var temp = driverDispatchService.endDate.set({
                  year: date.year,
                  month: date.month,
                  day: date.day
                });
                driverDispatchService.endDate = temp.endOf("day");

                if (
                  driverDispatchService.endDate
                    .diff(driverDispatchService.startDate)
                    .valueOf() < 0
                ) {
                  driverDispatchService.startDate =
                    driverDispatchService.endDate.startOf("day");
                }

                this.props.onTopFilterChange();
              }}
            />
          </div>
          <div className="c-driverDispatch-filters-datetime">
            <TimeComponent
              headline={Localization.operationsValue("Dispatch_TimeStart")}
              seconds={this.state.startTimeInSeconds}
              onChange={seconds => {
                var temp = DateTime.local().startOf("day");

                if (driverDispatchService.startTime) {
                  temp = driverDispatchService.startTime.set({
                    hour: seconds / this.intervalInSeconds
                  });
                } else {
                  temp = temp.set({
                    hour: seconds / this.intervalInSeconds
                  });
                  driverDispatchService.endTime = temp;
                  this.setState({
                    endTimeInSeconds: seconds
                  });
                }
                driverDispatchService.startTime = temp;

                if (
                  driverDispatchService.startTime
                    .diff(driverDispatchService.endTime)
                    .valueOf() > 0
                ) {
                  driverDispatchService.endTime =
                    driverDispatchService.startTime;
                  this.setState({
                    endTimeInSeconds: seconds
                  });
                }

                this.setState({ startTimeInSeconds: seconds });
                this.props.onTopFilterChange();
              }}
              interval={15}
            />
            <TimeComponent
              headline={Localization.operationsValue("Dispatch_TimeEnd")}
              seconds={this.state.endTimeInSeconds}
              onChange={seconds => {
                var temp = DateTime.local().startOf("day");

                if (driverDispatchService.endTime) {
                  temp = driverDispatchService.endTime.set({
                    hour: seconds / this.intervalInSeconds
                  });
                } else {
                  temp = temp.set({
                    hour: seconds / this.intervalInSeconds
                  });
                  driverDispatchService.startTime = temp;
                  this.setState({
                    startTimeInSeconds: seconds
                  });
                }
                driverDispatchService.endTime = temp;

                if (
                  driverDispatchService.endTime
                    .diff(driverDispatchService.startTime)
                    .valueOf() < 0
                ) {
                  driverDispatchService.startTime =
                    driverDispatchService.endTime;
                  this.setState({
                    startTimeInSeconds: seconds
                  });
                }

                this.setState({ endTimeInSeconds: seconds });
                this.props.onTopFilterChange();
              }}
              interval={15}
            />
          </div>
          {this.props.page === "dispatch" && (
            <InputRadioGroup
              radioButtons={[
                {
                  value: DispatchState.map.forecast.value,
                  headline: DispatchState.map.forecast.name
                },
                {
                  value: DispatchState.map.prebooking.value,
                  headline: DispatchState.map.prebooking.name
                },
                {
                  value: DispatchState.map.unassignedRoute.value,
                  headline: DispatchState.map.unassignedRoute.name
                },
                {
                  value: DispatchState.map.assignedRoute.value,
                  headline: DispatchState.map.assignedRoute.name
                }
              ]}
              checkedValue={driverDispatchService.state.value}
              onChange={value => {
                this.props.onStateChange(new DispatchState(value));
              }}
            />
          )}
        </Slider>
        {driverDispatchService.fulfillees.length > 0 && (
          <Slider collapsible={true} headline={Localization.sharedValue("User_Fulfillee")}>
            <CheckboxFilter
              data={driverDispatchService.fulfillees.map(f => {
                return {
                  label: f.name,
                  value: f.id,
                  checked:
                    driverDispatchService.fulfilleeFilters.filter(
                      cf => cf.id === f.id
                    ).length > 0
                };
              })}
              onChange={checkedData => {
                driverDispatchService.fulfilleeFilters = checkedData.map(d => {
                  return { name: d.label, id: d.value };
                });
                this.props.onFilterChange();
              }}
            />
          </Slider>
        )}
        {(driverDispatchService.state.slug ===
            DispatchState.map.prebooking.slug) && (
          <>
            {driverDispatchService.drivers.length > 0 && (
              <Slider collapsible={true} headline={Localization.sharedValue("User_Driver")}>
                <CheckboxFilter
                  data={driverDispatchService.drivers.map(d => {
                    return {
                      label: `${d.name} (${d.id})`,
                      value: d.id,
                      checked:
                        driverDispatchService.driverFilters.filter(
                          df => df.id === d.id
                        ).length > 0
                    };
                  })}
                  onChange={checkedData => {
                    driverDispatchService.driverFilters = checkedData.map(d => {
                      return { name: d.label, id: d.value };
                    });
                    this.props.onFilterChange();
                  }}
                />
              </Slider>
            )}

            {driverDispatchService.hauliers.length > 0 && (
              <Slider collapsible={true} headline={Localization.sharedValue("Haulier")}>
                <CheckboxFilter
                  data={driverDispatchService.hauliers.map(h => {
                    return {
                      label: h.name,
                      value: h.id,
                      checked:
                        driverDispatchService.haulierFilters.filter(
                          hf => hf.id === h.id
                        ).length > 0
                    };
                  })}
                  onChange={checkedData => {
                    driverDispatchService.haulierFilters = checkedData.map(
                      d => {
                        return { name: d.label, id: d.value };
                      }
                    );
                    this.props.onFilterChange();
                  }}
                />
              </Slider>
            )}
          </>
        )}
      </div>
    );
  }
}
