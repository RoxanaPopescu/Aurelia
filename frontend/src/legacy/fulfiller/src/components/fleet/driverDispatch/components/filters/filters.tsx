import React from "react";
import "./filters.scss";
import { observer } from "mobx-react";
import DateComponent from "shared/src/webKit/date/date";
import {
  InputRadioGroup,
  Select,
  Button,
  ButtonSize,
  ButtonType,
  Input,
  InputCheckbox
} from "shared/src/webKit";
import Slider from "./components/slider/slider";

@observer
export default class extends React.Component {
  render() {
    return (
      <div className="c-driverDispatch-filters">
        <Slider headline="Generelle indstillinger">
          <Button type={ButtonType.Light} size={ButtonSize.Small}>
            Reset
          </Button>
          <DateComponent
            headline="Date"
            onChange={() => {
              /* */
            }}
          />
          <Select
            headline="Time period"
            options={[
              {
                label: "Early morning",
                value: "earlyMorning"
              },
              {
                label: "Before dinner",
                value: "beforeDinner"
              }
            ]}
            onSelect={() => {
              /* */
            }}
          />
          <InputRadioGroup
            radioButtons={[
              { value: "forecast", headline: "Forecast" },
              { value: "preBookings", headline: "Pre-bookings" },
              { value: "unassignedRoutes", headline: "Unassigned routes" },
              { value: "assignedRoutes", headline: "Assigned routes" }
            ]}
            onChange={() => {
              /* */
            }}
          />
        </Slider>
        <Slider headline="Kunde">
          <Button type={ButtonType.Light} size={ButtonSize.Small}>
            Reset
          </Button>
          <Input headline="Name or id" placeholder="Type a name or id here" />
          {[
            { name: "COOP Mad", id: "38756" },
            { name: "COOP Logistik", id: "387436" },
            { name: "TIER", id: "384366" },
            { name: "Lime", id: "142566" }
          ].map(customer => {
            return (
              <InputCheckbox
                key={customer.id}
                onChange={() => {
                  /* */
                }}
              >
                {customer.name}
              </InputCheckbox>
            );
          })}
        </Slider>
        <Slider headline="Vognmand">
          <Button type={ButtonType.Light} size={ButtonSize.Small}>
            Reset
          </Button>
          <Input headline="Name or id" placeholder="Type a name or id here" />
          {[
            { name: "Louis Bishop ApS", id: "358856" },
            { name: "Craig George ApS", id: "38709342" },
            { name: "Howard Harper ApS", id: "897498" },
            { name: "Jason Mitchell ApS", id: "756476" }
          ].map(customer => {
            return (
              <InputCheckbox
                key={customer.id}
                onChange={() => {
                  /* */
                }}
              >
                {customer.name}
              </InputCheckbox>
            );
          })}
        </Slider>
        <Slider headline="Chauffør">
          <Button type={ButtonType.Light} size={ButtonSize.Small}>
            Reset
          </Button>
          <Input headline="Name or id" placeholder="Type a name or id here" />
          {[
            { name: "Jeffery Gilbert", id: "6523" },
            { name: "Eugene Franklin", id: "19363" },
            { name: "Captain America", id: "25799" },
            { name: "Deadpool", id: "97643644" }
          ].map(customer => {
            return (
              <InputCheckbox
                key={customer.id}
                onChange={() => {
                  /* */
                }}
              >
                {customer.name}
              </InputCheckbox>
            );
          })}
        </Slider>
      </div>
    );
  }
}
