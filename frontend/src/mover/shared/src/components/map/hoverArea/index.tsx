import React from "react";
import "./styles.scss";

interface Props {
  onMouseEnter: (owner: string) => void;
  onMouseLeave: (owner: string) => void;
}

export default class MapHoverArea extends React.Component<Props> {
  render() {
    const owner = `infoWindow`;
    return (
      <div
        className="c-map-infoWindowHoverArea"
        onMouseEnter={() => this.props.onMouseEnter(owner)}
        onMouseLeave={() => {
          setTimeout(() => {
            this.props.onMouseLeave(owner);
          });
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
