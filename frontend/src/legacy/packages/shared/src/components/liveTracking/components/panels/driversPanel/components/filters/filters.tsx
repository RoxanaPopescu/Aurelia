import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Input } from "shared/src/webKit";
import "./filters.scss";

export interface RoutesLayerProps {
  textFilter: string | undefined;
  onTextFilterChange: (textFilter: string) => void;
  message: string | undefined;
  showPush: boolean;
  onMessageChange: (message: string) => void;
}

@observer
export class Filters extends React.Component<RoutesLayerProps> {
  public render() {
    return (
      <div className="c-liveTracking-pushDriversPanel-filters">
        <Input
          type="search"
          placeholder={Localization.sharedValue("Input_Placeholder_Filter")}
          value={this.props.textFilter}
          onChange={value => this.props.onTextFilterChange(value)}
        />
        { this.props.showPush &&
          <Input
          value={this.props.message}
          placeholder="Custom push message?"
          onChange={v => this.props.onMessageChange(v)}
        />
        }
      </div>
    );
  }
}
