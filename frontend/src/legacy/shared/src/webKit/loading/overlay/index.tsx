import React from "react";
import "./style.scss";
import ThreeDotsAnimated from "../threeDotsAnimated";

export interface Props {
  fade?: boolean;
}

export default class LoadingOverlay extends React.Component<Props> {
  render() {
    return (
      <div
        className={`
          loadingOverlayContainer
          ${this.props.fade !== false ? "loadingOverlayContainer--fade" : ""}`}
      >
        <ThreeDotsAnimated small={false} light={false} className="image" />
      </div>
    );
  }
}
