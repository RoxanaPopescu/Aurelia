import React from "react";
import "./filters.scss";
import DateComponent from "shared/src/webKit/date/date";
import { InputRadioGroup } from "shared/src/webKit";
import Slider from "./components/slider/slider";
import CheckboxFilter from "./components/checkboxFilter/checkboxFilter";
import { observer } from "mobx-react";
import { driverDispatchService } from "../../driverDispatchService";

interface Props {}

@observer
export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.fetchOverviewData();
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

  private async fetchOverviewData(): Promise<void> {
    await driverDispatchService.fetchOverview();

    this.fetchData();
  }

  private async fetchData(): Promise<void> {
    if (driverDispatchService.state === "forecasts") {
      driverDispatchService.forecasts = await driverDispatchService.fetchForecasts();
    } else if (driverDispatchService.state === "preBookings") {
      driverDispatchService.preBookings = await driverDispatchService.fetchPreBookings();
    }
    // TODO: Assigned and unassigned routes
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
          <InputRadioGroup
            radioButtons={[
              { value: "forecasts", headline: "Forecast" },
              { value: "preBookings", headline: "Pre-bookings" },
              { value: "unassignedRoutes", headline: "Unassigned routes" },
              { value: "assignedRoutes", headline: "Assigned routes" }
            ]}
            checkedValue={driverDispatchService.state}
            onChange={value => {
              driverDispatchService.state = value;
              this.fetchOverviewData();
            }}
          />
        </Slider>
        <Slider headline="Kunde">
          <CheckboxFilter
            data={driverDispatchService.consignors.map(c => {
              return {
                label: c.name,
                value: c.id,
                checked:
                  driverDispatchService.consignorFilters.filter(
                    cf => cf.id === c.id
                  ).length > 0
              };
            })}
            onChange={checkedData => {
              driverDispatchService.consignorFilters = checkedData.map(d => {
                return { name: d.label, id: d.value };
              });
              this.fetchData();
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
                  this.fetchData();
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
                  this.fetchData();
                }}
              />
            </Slider>
          </>
        )}
      </div>
    );
  }
}
