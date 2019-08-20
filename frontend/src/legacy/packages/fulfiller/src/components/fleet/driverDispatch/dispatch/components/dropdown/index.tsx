import React from "react";
import "./index.scss";
import { Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { driverDispatchService } from "../../../driverDispatchService";
import { observer } from "mobx-react";

interface Props {
  removePrebookingDrivers();
  assignPrebookingDrivers();
}

interface State {
  dropdownOpen: boolean;
}

@observer
export default class extends React.Component<Props, State> {
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

  private get classNames() {
    var classNames = "c-driverDispatch-buttonDropdown";
    if (this.state.dropdownOpen) {
      classNames += " open";
    }
    if (driverDispatchService.selectedItemIndexes.length === 0) {
      classNames += " disabled";
    }

    return classNames;
  }

  render() {
    return (
      <div ref={e => (this.node = e)} className={this.classNames}>
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
            {/* <div
              onClick={() => {
                this.setState({ dropdownOpen: false });
              }}
              className="c-driverDispatch-dropdown-value"
            >
              Change drivers
            </div> */}
            <div
              onClick={() => {
                this.props.removePrebookingDrivers();
                this.setState({ dropdownOpen: false });
              }}
              className="c-driverDispatch-dropdown-value"
            >
              Remove drivers
            </div>
            <div
              onClick={() => {
                this.props.assignPrebookingDrivers();
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
