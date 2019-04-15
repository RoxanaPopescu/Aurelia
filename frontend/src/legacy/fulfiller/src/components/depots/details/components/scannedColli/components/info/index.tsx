import React from "react";
import "./styles.scss";

interface Props {
  title: string;
  description: string;
}

export default class DepotScannedColliInfoComponent extends React.Component<
  Props
> {
  public render() {
    return (
      <div className="c-depots-scannedColli-infoContainer">
        <div className="c-depots-scannedColli-infoTitle font-small">
          {this.props.title}
        </div>
        <div className="c-depots-scannedColli-infoDescription font-larger">
          {this.props.description}
        </div>
      </div>
    );
  }
}
