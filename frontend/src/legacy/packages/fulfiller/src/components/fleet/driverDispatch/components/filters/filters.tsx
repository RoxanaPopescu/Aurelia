import React from "react";
import "./filters.scss";
import DateComponent from "shared/src/webKit/date/date";
import { InputRadioGroup, Select, Button } from "shared/src/webKit";
import Slider from "./components/slider/slider";
import CheckboxFilter from "./components/checkboxFilter/checkboxFilter";
import { observer } from "mobx-react";
import {
  driverDispatchService,
  DispatchState
} from "../../driverDispatchService";
import TimeComponent from "shared/src/webKit/date/time";
import { SelectOptionValue } from "shared/src/webKit/select";
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
  startTimeInSeconds: number;
  duration?: number;
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      startTimeInSeconds: 0
    };
  }

  // private getDistinct(array: { name: string; id: string }[]) {
  //   var distinctArray: { name: string; id: string }[] = [];
  //   const map = new Map();
  //   for (const item of array) {
  //     if (!map.has(item.id)) {
  //       map.set(item.id, true); // set any value to Map
  //       distinctArray.push({
  //         id: item.id,
  //         name: item.name
  //       });
  //     }
  //   }

  //   return distinctArray;
  // }

  getDurationOptions() {
    let array: SelectOptionValue[] = [];

    for (var i = 1; i <= 24; i++) {
      array.push({
        label: i.toString(),
        value: i,
        labelNote: `time${i > 1 ? "r" : ""}`
      });
    }

    return array;
  }

  render() {
    return (
      <div className="c-driverDispatch-filters">
        <Slider headline="Generelle indstillinger">
          <Button
            type={ButtonType.Light}
            size={ButtonSize.Small}
            onClick={() => {
              driverDispatchService.setDefaultValues();
              this.setState({
                startTimeInSeconds: 0,
                duration: undefined
              });

              this.props.onTopFilterChange();
            }}
          >
            Reset all
          </Button>
          <DateComponent
            headline="Date"
            date={driverDispatchService.startDateTime}
            onChange={date => {
              var temp = driverDispatchService.startDateTime.set({
                year: date.year,
                month: date.month,
                day: date.day
              });
              driverDispatchService.startDateTime = temp;

              driverDispatchService.endDateTime = temp.plus({
                hours: this.state.duration,
                milliseconds: this.state.startTimeInSeconds
              });

              this.props.onTopFilterChange();
            }}
          />
          <TimeComponent
            headline="Time"
            onChange={seconds => {
              var temp = driverDispatchService.startDateTime.set({
                hour: seconds / 3600
              });
              driverDispatchService.startDateTime = temp;

              driverDispatchService.endDateTime = temp.plus(
                this.state.duration ? this.state.duration : 24
              );

              this.setState({ startTimeInSeconds: seconds });

              this.props.onTopFilterChange();
            }}
            interval={60}
          />
          <Select
            headline="Duration"
            options={this.getDurationOptions()}
            value={this.state.duration}
            onSelect={option => {
              if (option) {
                driverDispatchService.endDateTime = driverDispatchService.endDateTime.plus(
                  {
                    hours: option.value
                  }
                );

                this.setState({ duration: option.value });

                this.props.onTopFilterChange();
              }
            }}
          />
          {this.props.page === "dispatch" && (
            <InputRadioGroup
              radioButtons={[
                {
                  value: DispatchState.map.forecast.value,
                  headline: DispatchState.map.forecast.name
                },
                {
                  value: DispatchState.map.preBooking.value,
                  headline: DispatchState.map.preBooking.name
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
        <Slider collapsible={true} headline="Kunde">
          <CheckboxFilter
            data={driverDispatchService.fulfillees.map(c => {
              return {
                label: c.name,
                value: c.id,
                checked:
                  driverDispatchService.fulfilleeFilters.filter(
                    cf => cf.id === c.id
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
        {(driverDispatchService.state.slug ===
          DispatchState.map.assignedRoute.slug ||
          driverDispatchService.state.slug ===
            DispatchState.map.preBooking.slug) && (
          <>
            {driverDispatchService.drivers.length > 0 && (
              <Slider collapsible={true} headline="Chauffør">
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
              <Slider collapsible={true} headline="Vognmand">
                <CheckboxFilter
                  data={driverDispatchService.hauliers.map(h => {
                    return {
                      label: `${h.name}`,
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
