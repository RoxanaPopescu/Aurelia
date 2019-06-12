import React from "react";
import "./index.scss";
import { Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { driverDispatchService } from "../../../driverDispatchService";

interface Props {
  removePreBookingDrivers();
}

interface State {
  dropdownOpen: boolean;
}

export default class DropdownComponent extends React.Component<Props, State> {
  node;
  constructor(props: Props) {
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
      this.setState({ dropdownOpen: true });
      return;
    }

    this.setState({ dropdownOpen: false });
  }

  render() {
    return (
      <div
        ref={e => (this.node = e)}
        className={`c-driverDispatch-buttonDropdown${
          this.state.dropdownOpen ? " open" : ""
        }
          ${
            driverDispatchService.selectedItemIndexes.length > 0
              ? ""
              : " disabled"
          }`}
      >
        <Button
          className="c-driverDispatch-buttonDropdown-button"
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          disabled={driverDispatchService.selectedItemIndexes.length === 0}
        >
          Choose action
          <div className="arrow" />
        </Button>
        {this.state.dropdownOpen && (
          <div className="c-driverDispatch-dropdown">
            <div
              onClick={() => {
                this.setState({ dropdownOpen: false });
              }}
              className="c-driverDispatch-dropdown-value"
            >
              Change drivers
            </div>
            <div
              onClick={() => {
                this.props.removePreBookingDrivers();
                this.setState({ dropdownOpen: false });
              }}
              className="c-driverDispatch-dropdown-value"
            >
              Remove drivers
            </div>
            <div
              onClick={() => {
                this.setState({ dropdownOpen: false });
              }}
              className="c-driverDispatch-dropdown-value"
            >
              Match with route
            </div>
          </div>
        )}
      </div>
    );
  }
}
