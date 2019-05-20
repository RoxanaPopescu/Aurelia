import React from "react";
import "./filters.scss";
import DateComponent from "shared/src/webKit/date/date";
import { InputRadioGroup, Select } from "shared/src/webKit";
import Slider from "./components/slider/slider";
import CheckboxFilter from "./components/checkboxFilter/checkboxFilter";
import { observer } from "mobx-react";
import { driverDispatchService } from "../../driverDispatchService";
import TimeComponent from "shared/src/webKit/date/time";
import { SelectOptionValue } from "shared/src/webKit/select";

interface Props {
  // tslint:disable-next-line: no-any
  onStateChange(state: any);
  onFilterChange();
}

@observer
export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
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
          <DateComponent
            headline="Date"
            date={driverDispatchService.date}
            onChange={date => {
              driverDispatchService.date = date;
            }}
          />
          <TimeComponent
            headline="Time"
            onChange={() => {
              /* */
            }}
            interval={60}
          />
          <Select
            headline="Duration"
            options={this.getDurationOptions()}
            onSelect={() => {
              /**/
            }}
          />
          <InputRadioGroup
            radioButtons={[
              { value: "forecasts", headline: "Forecast" },
              { value: "preBookings", headline: "Pre-bookings" },
              { value: "unassignedRoutes", headline: "Unassigned routes" },
              { value: "assignedRoutes", headline: "Assigned routes" }
            ]}
            checkedValue={driverDispatchService.state}
            onChange={value => {
              this.props.onStateChange(value);
            }}
          />
        </Slider>
        <Slider headline="Kunde">
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
        {(driverDispatchService.state === "assignedRoutes" ||
          driverDispatchService.state === "preBookings") && (
          <>
            <Slider headline="Vognmand">
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
                  driverDispatchService.haulierFilters = checkedData.map(d => {
                    return { name: d.label, id: d.value };
                  });
                  this.props.onFilterChange();
                }}
              />
            </Slider>
            <Slider headline="Chauffør">
              <CheckboxFilter
                data={driverDispatchService.drivers.map(d => {
                  return {
                    label: d.name,
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
          </>
        )}
      </div>
    );
  }
}
