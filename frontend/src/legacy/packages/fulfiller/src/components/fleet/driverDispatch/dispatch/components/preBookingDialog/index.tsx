import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { Dialog } from "shared/src/components/dialog/dialog";
import { PreBooking } from "../../../models/preBooking";
import { DateTime } from "luxon";
import { Button, TableComponent, InputCheckbox } from "shared/src/webKit";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../../../shared/src/webKit/button/index";
import Localization from "shared/src/localization";
import { Link } from "react-router-dom";
import { FulfillerSubPage } from "../../../../../navigation/page";

interface Props {
  data: { preBookings: PreBooking[]; state?: "actions" | "change" | "remove" };
  onRemove(preBookings: PreBooking[]): Promise<boolean>;
  onClose();
}

interface State {
  state: "actions" | "change" | "remove";
  selectedPreBookings: PreBooking[];
  notifyDriver: boolean;
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      state: props.data.state ? props.data.state : "actions",
      selectedPreBookings: props.data.preBookings,
      notifyDriver: true
    };
  }

  private getActionItems(): JSX.Element[] {
    if (this.state.state === "remove") {
      return [
        // tslint:disable-next-line: jsx-wrap-multiline
        <InputCheckbox
          checked={this.state.notifyDriver}
          onChange={() =>
            this.setState({ notifyDriver: !this.state.notifyDriver })
          }
          key="notify-driver-toggle"
        >
          Send notification via SMS
        </InputCheckbox>,
        // tslint:disable-next-line: jsx-wrap-multiline
        <Button
          key="remove-driver-confirm"
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => {
            var success = this.props.onRemove(this.state.selectedPreBookings);
            if (success) {
              this.props.onClose();
            }
          }}
        >
          Confirm
        </Button>
      ];
    } else {
      return [
        // // tslint:disable-next-line: jsx-wrap-multiline
        // <Button
        //   key="change-driver"
        //   type={ButtonType.Light}
        //   size={ButtonSize.Medium}
        // >
        //   Change driver
        // </Button>,
        // tslint:disable-next-line: jsx-wrap-multiline
        <Button
          key="remove-driver"
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => {
            this.setState({
              selectedPreBookings: this.props.data.preBookings,
              state: "remove"
            });
          }}
        >
          Remove driver
        </Button>,
        // tslint:disable-next-line: jsx-wrap-multiline
        <Link
          key="match-with-route"
          to={FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
            .replace(
              ":ids",
              this.state.selectedPreBookings.map(p => p.id).join(",")
            )
            .replace(":origin", "pre-bookings")}
        >
          <Button type={ButtonType.Light} size={ButtonSize.Medium}>
            Match with a route
          </Button>
        </Link>
      ];
    }
  }

  private renderSummary(preBooking: PreBooking) {
    return (
      <div className="c-driverDispatch-preBookingDialog-summary">
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-preBookingDialog-icon"
            src={require("../../../assets/icons/company.svg")}
          />
          {preBooking.forecast.fulfillee.name}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-preBookingDialog-icon"
            src={require("../../../assets/icons/calendar.svg")}
          />
          {preBooking.forecast.date.toLocaleString(DateTime.DATE_SHORT)}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-preBookingDialog-icon"
            src={require("../../../assets/icons/watch.svg")}
          />
          {`${Localization.formatTimeRange(preBooking.forecast.timePeriod)}`}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-preBookingDialog-icon"
            src={require("../../../assets/icons/van.svg")}
          />
          {preBooking.forecast.vehicleType.name}
        </h4>
      </div>
    );
  }

  private renderInformation(preBooking: PreBooking) {
    return (
      <div className="c-driverDispatch-preBookingDialog-information">
        <div className="c-driverDispatch-preBookingDialog-infobox">
          <h4 className="font-heading">Starting address</h4>
          <h4>{`${preBooking.forecast.startingLocation.address.primary}, ${
            preBooking.forecast.startingLocation.address.secondary
          }`}</h4>
        </div>
        <div className="c-driverDispatch-preBookingDialog-infobox">
          <h4 className="font-heading">Driver</h4>
          <h4>{preBooking.driver.formattedName}</h4>
          <h4>{preBooking.driver.phone.number}</h4>
        </div>
      </div>
    );
  }

  private getRemoveHeadline() {
    if (this.state.selectedPreBookings.length === 1) {
      return `You are about to remove ${
        this.state.selectedPreBookings[0].driver.formattedName
      }'s pre-booking`;
    } else {
      return `You are about to remove ${
        this.state.selectedPreBookings.length
      } pre-bookings`;
    }
  }

  private get title() {
    if (this.state.state === "remove") {
      return "Remove pre-booking";
    } else {
      return "Assigning of pre-booking";
    }
  }

  private getHeaders() {
    return [
      {
        key: "select",
        content: (
          <InputCheckbox
            checked={
              this.state.selectedPreBookings.length ===
              this.props.data.preBookings.length
            }
            onChange={checked => {
              var checkedRows: PreBooking[] = [];
              if (checked) {
                checkedRows = this.props.data.preBookings;
              }
              this.setState({ selectedPreBookings: checkedRows });
            }}
          />
        )
      },
      { key: "customer", content: "Customer" },
      { key: "date-start", content: "Date start" },
      { key: "time-period", content: "Time period" },
      { key: "starting-addresse", content: "Starting address" },
      { key: "driver", content: "Driver" },
      { key: "vehicle", content: "Vehicle" }
    ];
  }

  private getRows() {
    return this.props.data.preBookings.map((p, i) => {
      return [
        // tslint:disable-next-line: jsx-wrap-multiline
        <InputCheckbox
          checked={
            this.state.selectedPreBookings.filter(sp => sp.id === p.id).length >
            0
          }
          onChange={checked => {
            var checkedRows = this.state.selectedPreBookings;
            if (checked) {
              checkedRows.push(p);
            } else {
              checkedRows = checkedRows.filter(r => r.id !== p.id);
            }

            this.setState({ selectedPreBookings: checkedRows });
          }}
          key={p.id}
        />,
        p.forecast.fulfillee.name,
        Localization.formatDate(p.forecast.date),
        Localization.formatTimeRange(p.forecast.timePeriod),
        p.forecast.startingLocation.address.primary,
        `${p.driver.formattedName} (${p.driver.phone.number})`,
        p.forecast.vehicleType.name
      ];
    });
  }

  private renderTable() {
    return (
      <TableComponent
        canSelectRow={() => false}
        newVersion={true}
        data={{
          headers: this.getHeaders(),
          rows: this.getRows()
        }}
        highlightedRowIndexes={this.state.selectedPreBookings.map((p, i) => i)}
        gridTemplateColumns="min-content auto auto auto auto auto auto"
      />
    );
  }

  render() {
    return (
      <Dialog
        title={this.title}
        onClose={() => {
          this.props.onClose();
        }}
        closeOnClickOutside={true}
        className="c-driverDispatch-preBookingDialog"
        actionItems={this.getActionItems()}
      >
        {this.state.state === "remove" && (
          <h4 className="font-larger">{this.getRemoveHeadline()}</h4>
        )}
        {this.props.data.preBookings.length === 1 &&
          this.renderSummary(this.props.data.preBookings[0])}
        {this.props.data.preBookings.length === 1 &&
          this.renderInformation(this.props.data.preBookings[0])}
        {this.props.data.preBookings.length > 1 && this.renderTable()}
      </Dialog>
    );
  }
}
