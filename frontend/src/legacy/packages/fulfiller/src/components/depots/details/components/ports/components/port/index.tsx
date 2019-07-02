import React from "react";
import { Icon } from "shared/src/webKit";
import "./styles.scss";
import { Availability } from "shared/src/model/logistics/depots/availability";
import Localization from "../../../../../../../../../shared/src/localization/index";
import { DateHelper } from "../../../../../../../../../shared/src/utillity/dateHelper";
import { observer } from "mobx-react";

export interface Props {
  port: Availability;
  selected?: boolean;
  onEdit: () => void;
}

@observer
export class PortComponent extends React.Component<Props> {
  public render() {
    return (
      <div
        className={`c-depotsPort-rule ${
          this.props.selected ? "c-depotsPort-rule--selected" : ""
        }`}
      >
        {this.props.port.numberOfGates} Porte
        <br />
        Åben fra{" "}
        {Localization.formatTime(
          DateHelper.startOfDay(this.props.port.openingTime!)
        )}{" "}
        til{" "}
        {Localization.formatTime(
          DateHelper.startOfDay(this.props.port.closingTime!)
        )}
        <br />I dagene{" "}
        {Localization.formatWeekdays(this.props.port.daysOfWeek!)}
        <div className="c-depotsPort-rule-actions">
          <Icon name="edit" onClick={() => this.props.onEdit()} />
        </div>
      </div>
    );
  }
}
