import React from "react";
import "./panel.scss";

export interface PanelProps {
  hidden?: boolean;
  className?: string;
}

export class Panel extends React.Component<PanelProps> {

  public render() {
    return (
      <div
        className={`
          c-liveTracking-panel
          ${this.props.className || ""}
          ${this.props.hidden ? "c-liveTracking-panel-hidden" : ""}
        `}
      >
        {this.props.children}
      </div>
    );
  }
}
