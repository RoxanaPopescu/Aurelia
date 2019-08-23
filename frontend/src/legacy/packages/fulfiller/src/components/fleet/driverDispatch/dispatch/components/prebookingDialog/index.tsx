import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { Dialog } from "shared/src/components/dialog/dialog";
import { Prebooking } from "../../../models/prebooking";
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
  data: { prebookings: Prebooking[]; state?: "actions" | "change" | "remove" };
  onRemove(prebookings: Prebooking[]): Promise<boolean>;
  onClose();
}

interface State {
  state: "actions" | "change" | "remove";
  selectedPrebookings: Prebooking[];
  notifyDriver: boolean;
}

@observer
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      state: props.data.state ? props.data.state : "actions",
      selectedPrebookings: props.data.prebookings,
      notifyDriver: true
    };
  }

  private getActionItems(): JSX.Element[] {
    if (this.state.state === "remove") {
      return [
        // // tslint:disable-next-line: jsx-wrap-multiline
        // <InputCheckbox
        //   checked={this.state.notifyDriver}
        //   onChange={() =>
        //     this.setState({ notifyDriver: !this.state.notifyDriver })
        //   }
        //   key="notify-driver-toggle"
        // >
        //   Send notification via SMS
        // </InputCheckbox>,
        // tslint:disable-next-line: jsx-wrap-multiline
        <Button
          key="remove-driver-confirm"
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => {
            var success = this.props.onRemove(this.state.selectedPrebookings);
            if (success) {
              this.props.onClose();
            }
          }}
        >
          {Localization.sharedValue("Action_Confirm")}
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
              selectedPrebookings: this.props.data.prebookings,
              state: "remove"
            });
          }}
        >
          {Localization.operationsValue("Dispatch_Prebooking__RemoveDriver")}
        </Button>,
        // tslint:disable-next-line: jsx-wrap-multiline
        <Link
          key="match-with-route"
          to={FulfillerSubPage.path(FulfillerSubPage.AssignRoutes)
            .replace(
              ":ids",
              this.state.selectedPrebookings.map(p => p.id).join(",")
            )
            .replace(":origin", "prebookings")}
        >
          <Button type={ButtonType.Light} size={ButtonSize.Medium}>
            {Localization.operationsValue("Dispatch_Prebooking__Match")}
          </Button>
        </Link>
      ];
    }
  }

  private renderSummary(prebooking: Prebooking) {
    return (
      <div className="c-driverDispatch-prebookingDialog-summary">
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../../../assets/icons/company.svg")}
          />
          {prebooking.forecast.fulfillee.name}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../../../assets/icons/calendar.svg")}
          />
          {prebooking.forecast.date.toLocaleString(DateTime.DATE_SHORT)}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../../../assets/icons/watch.svg")}
          />
          {`${Localization.formatTimeRange(prebooking.forecast.timePeriod)}`}
        </h4>
        <h4 className="font-larger">
          <img
            className="c-driverDispatch-prebookingDialog-icon"
            src={require("../../../assets/icons/van.svg")}
          />
          {prebooking.forecast.vehicleType.name}
        </h4>
      </div>
    );
  }

  private renderInformation(prebooking: Prebooking) {
    return (
      <div className="c-driverDispatch-prebookingDialog-information">
        <div className="c-driverDispatch-prebookingDialog-infobox">
          <h4 className="font-heading">{Localization.operationsValue("Dispatch_StartingAddress")}</h4>
          <h4>{`${prebooking.forecast.startingLocation.address.primary}, ${
            prebooking.forecast.startingLocation.address.secondary
          }`}</h4>
        </div>
        <div className="c-driverDispatch-prebookingDialog-infobox">
          <h4 className="font-heading">{Localization.operationsValue("Dispatch_Driver")}</h4>
          <h4>{prebooking.driver.formattedName}</h4>
          <h4>{prebooking.driver.phone.number}</h4>
        </div>
      </div>
    );
  }

  private getRemoveHeadline() {
    if (this.state.selectedPrebookings.length === 1) {
      return Localization.operationsValue("Dispatch_Prebookings_RemoveWarning__Single")
              .replace("{driver}", this.state.selectedPrebookings[0].driver.formattedName)
              .replace("{customer}", this.state.selectedPrebookings[0].forecast.fulfillee.name);
    } else {
      return Localization.operationsValue("Dispatch_Prebookings_RemoveWarning__Multiple")
              .replace("{number}", this.state.selectedPrebookings.length.toString())
              .replace("{customer}", this.state.selectedPrebookings.map(p => p.forecast.fulfillee.name).join(","));
    }
  }

  private get title() {
    if (this.state.state === "remove") {
      return Localization.operationsValue("Dispatch_Prebookings_Remove__Title");
    } else {
      return Localization.operationsValue("Dispatch_Prebookings_Action__Title");
    }
  }

  private getHeaders() {
    return [
      {
        key: "select",
        content: (
          <InputCheckbox
            checked={
              this.state.selectedPrebookings.length ===
              this.props.data.prebookings.length
            }
            onChange={checked => {
              var checkedRows: Prebooking[] = [];
              if (checked) {
                checkedRows = this.props.data.prebookings;
              }
              this.setState({ selectedPrebookings: checkedRows });
            }}
          />
        )
      },
      { key: "customer", content: Localization.sharedValue("User_Customer") },
      { key: "date-start", content: Localization.operationsValue("Dispatch_DateStart") },
      { key: "time-period", content: Localization.operationsValue("TimePeriod") },
      { key: "starting-addresse", content: Localization.operationsValue("Dispatch_StartingAddress") },
      { key: "driver", content: Localization.operationsValue("Dispatch_Driver") },
      { key: "vehicle", content: Localization.sharedValue("Vehicle") }
    ];
  }

  private getRows() {
    return this.props.data.prebookings.map((p, i) => {
      return [
        // tslint:disable-next-line: jsx-wrap-multiline
        <InputCheckbox
          checked={
            this.state.selectedPrebookings.filter(sp => sp.id === p.id).length >
            0
          }
          onChange={checked => {
            var checkedRows = this.state.selectedPrebookings;
            if (checked) {
              checkedRows.push(p);
            } else {
              checkedRows = checkedRows.filter(r => r.id !== p.id);
            }

            this.setState({ selectedPrebookings: checkedRows });
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
        highlightedRowIndexes={this.state.selectedPrebookings.map((p, i) => i)}
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
        className="c-driverDispatch-prebookingDialog"
        actionItems={this.getActionItems()}
      >
        {this.state.state === "remove" && (
          <h4 className="font-larger">{this.getRemoveHeadline()}</h4>
        )}
        {this.props.data.prebookings.length === 1 &&
          this.renderSummary(this.props.data.prebookings[0])}
        {this.props.data.prebookings.length === 1 &&
          this.renderInformation(this.props.data.prebookings[0])}
        {this.props.data.prebookings.length > 1 && this.renderTable()}
      </Dialog>
    );
  }
}
