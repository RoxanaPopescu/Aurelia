import React from "react";
import "./header.scss";
import { observer } from "mobx-react";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { driverDispatchService } from "../../driverDispatchService";
import { Button } from "shared/src/webKit";
import {
  ButtonType,
  ButtonSize
} from "../../../../../../../shared/src/webKit/button/index";

interface State {
  dropdownOpen: boolean;
}

@observer
export default class extends React.Component<{}, State> {
  node;
  constructor(props: {}) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  componentWillMount() {
    document.addEventListener("mousedown", e => this.handleClick(e), false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", e => this.handleClick(e), false);
  }

  private handleClick(e: MouseEvent) {
    if (this.node && this.node.contains(e.target)) {
      this.setState({ dropdownOpen: !this.state.dropdownOpen });
      return;
    }

    this.setState({ dropdownOpen: false });
  }

  private renderInfoBox(headline: string, value: string | number): JSX.Element {
    return (
      <div key={headline} className="c-driverDispatch-infoBox">
        <h4 className="font-heading">{headline}</h4>
        <h4 className="font-largest">{value}</h4>
      </div>
    );
  }

  private renderInfoBoxes(): JSX.Element {
    return (
      <div className="c-driverDispatch-infoBoxes">
        {driverDispatchService.overviewData.map(data =>
          this.renderInfoBox(data.name, data.value)
        )}
      </div>
    );
  }

  private get path() {
    if (driverDispatchService.state === "forecasts") {
      return { title: "Forecasts" };
    } else if (driverDispatchService.state === "preBookings") {
      return { title: "Pre-bookings" };
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return { title: "Unassigned routes" };
    } else {
      return { title: "Assigned routes" };
    }
  }

  private get actionElements() {
    if (driverDispatchService.state === "preBookings") {
      return (
        <div
          ref={e => (this.node = e)}
          className={`c-driverDispatch-buttonDropdown${
            this.state.dropdownOpen ? " open" : ""
          }`}
        >
          <Button
            className="c-driverDispatch-buttonDropdown-button"
            type={ButtonType.Light}
            size={ButtonSize.Medium}
          >
            Choose action
          </Button>
          {this.state.dropdownOpen && (
            <div className="c-driverDispatch-dropdown">
              <div className="c-driverDispatch-dropdown-value">
                Add other drivers
              </div>
              <div className="c-driverDispatch-dropdown-value">
                Remove drivers
              </div>
              <div className="c-driverDispatch-dropdown-value">
                Match with route
              </div>
            </div>
          )}
        </div>
      );
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return <Button type={ButtonType.Light}>Match route</Button>;
    } else if (driverDispatchService.state === "assignedRoutes") {
      return <Button type={ButtonType.Light}>Delete driver</Button>;
    } else {
      return undefined;
    }
  }

  render() {
    return (
      <PageHeaderComponent
        actionElements={this.actionElements}
        path={[{ title: "Chaufførdisponering" }, this.path]}
      >
        {this.renderInfoBoxes()}
      </PageHeaderComponent>
    );
  }
}
