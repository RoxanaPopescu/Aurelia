import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { Dialog } from "shared/src/components/dialog/dialog";
import {
  Button,
  ButtonType,
  ButtonSize,
  Select,
  InputNumbers
} from "shared/src/webKit";
import DateComponent from "shared/src/webKit/date/date";
import TimeComponent from "shared/src/webKit/date/time";
import { DateTime } from "luxon";
import AddressSearchComponent from "shared/src/components/addressSearch";
import { Location } from "shared/src/model/general/location";
import { Outfit } from "shared/src/model/logistics/outfit";
import { AgreementsService } from "shared/src/services/agreementsService";
import { VehicleType } from "shared/src/model/session";

interface Props {
  open: boolean;
  onCreate(forecast: {
    fulfillee: Outfit;
    dateFrom: DateTime;
    dateTimeFrom: DateTime;
    dateTimeTo: DateTime;
    startingLocation: Location;
    vehicleType: VehicleType;
    totalSlots: number;
  }): boolean;
  onClose(): void;
}

interface State {
  open: boolean;
  validate: boolean;
  fulfillees?: Outfit[];
  fulfillee?: Outfit;
  dateFrom?: DateTime;
  timeFrom?: number;
  timeTo?: number;
  startingLocation?: Location;
  vehicleType?: VehicleType;
  totalSlots?: number;
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: props.open,
      validate: false
    };
  }

  componentDidMount() {
    AgreementsService.fulfilees()
      .then(outfits => {
        this.setState({
          fulfillees: outfits
        });
      })
      .catch(error => {
        // Do nothing
      });
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      open: props.open
    });
  }

  private getTimeMinimum(): DateTime {
    var minTime = this.state.dateFrom
      ? this.state.dateFrom
      : DateTime.local().startOf("day");
    if (this.state.timeFrom) {
      minTime = minTime.plus({ seconds: this.state.timeFrom });
    }

    return minTime;
  }

  renderForm() {
    return (
      <>
        <Select
          headline="Customer"
          placeholder="Select a customer"
          options={
            this.state.fulfillees
              ? this.state.fulfillees.map(f => {
                  return { label: f.primaryName, value: f };
                })
              : []
          }
          size="medium"
          value={this.state.fulfillee}
          onSelect={option => {
            this.setState({
              fulfillee: option ? option.value : undefined
            });
          }}
          validate={this.state.validate}
          error={this.state.validate && !this.state.fulfillee}
        />
        <div className="c-driverDispatch-dateContainer">
          <DateComponent
            headline="Date start"
            minimum={DateTime.local().startOf("day")}
            date={this.state.dateFrom}
            size="medium"
            onChange={date => {
              this.setState({
                dateFrom: date.toLocal().startOf("day")
              });
            }}
            error={this.state.validate && !this.state.dateFrom}
          />
          <TimeComponent
            size="medium"
            headline="Time start"
            seconds={this.state.timeFrom}
            onChange={seconds => {
              this.setState({ timeFrom: seconds });
            }}
            interval={60}
            error={this.state.validate && !this.state.timeFrom}
          />
          <TimeComponent
            size="medium"
            headline="Time end"
            minimum={this.getTimeMinimum()}
            seconds={this.state.timeTo}
            onChange={seconds => {
              this.setState({ timeTo: seconds });
            }}
            interval={60}
            error={this.state.validate && !this.state.timeTo}
          />
        </div>
        <AddressSearchComponent
          headline="Starting address"
          onChange={location => {
            this.setState({ startingLocation: location });
          }}
          value={this.state.startingLocation}
          error={this.state.validate && !this.state.startingLocation}
          locationRequired={true}
        />
        <Select
          headline="Vehicle type"
          placeholder="Select a type"
          size="medium"
          options={VehicleType.getAll().map(vt => ({
            label: vt.name,
            value: vt.id
          }))}
          value={this.state.vehicleType}
          onSelect={option => {
            this.setState({
              vehicleType: option ? option.value : undefined
            });
          }}
          validate={this.state.validate}
          error={this.state.validate && !this.state.vehicleType}
        />
        <InputNumbers
          headline="Total amount of slots"
          className="c-driverDispatch-forecastDialog-slots"
          size="medium"
          value={this.state.totalSlots}
          onChange={value => {
            this.setState({ totalSlots: value });
          }}
          error={this.state.validate && !this.state.totalSlots}
        />
      </>
    );
  }

  private handleCreate() {
    if (
      this.state.fulfillee &&
      this.state.dateFrom &&
      this.state.timeFrom &&
      this.state.timeTo &&
      this.state.vehicleType &&
      this.state.startingLocation &&
      this.state.totalSlots
    ) {
      var dateTimeFrom = this.state.dateFrom.plus({
        seconds: this.state.timeFrom
      });
      var dateTimeTo = this.state.dateFrom.plus({ seconds: this.state.timeTo });
      if (this.state.timeFrom >= this.state.timeTo) {
        dateTimeTo = dateTimeTo.plus({ days: 1 });
      }

      var reset = this.props.onCreate({
        fulfillee: this.state.fulfillee,
        dateFrom: this.state.dateFrom,
        dateTimeFrom: dateTimeFrom,
        dateTimeTo: dateTimeTo,
        vehicleType: this.state.vehicleType,
        startingLocation: this.state.startingLocation,
        totalSlots: this.state.totalSlots
      });

      if (reset) {
        this.setState({
          open: false,
          fulfillee: undefined,
          dateFrom: undefined,
          startingLocation: undefined,
          vehicleType: undefined,
          totalSlots: undefined
        });
      }
    } else {
      this.setState({
        validate: true
      });
    }
  }

  render() {
    if (this.state.open) {
      return (
        <Dialog
          title="Create a Forecast"
          onClose={() => {
            this.props.onClose();
          }}
          closeOnClickOutside={true}
          className="c-driverDispatch-forecastDialog"
          actionItems={[
            <Button
              key="createButton"
              onClick={() => {
                this.handleCreate();
              }}
              size={ButtonSize.Medium}
              type={ButtonType.Action}
            >
              Create
            </Button>
          ]}
        >
          {this.renderForm()}
        </Dialog>
      );
    } else {
      return <></>;
    }
  }
}
