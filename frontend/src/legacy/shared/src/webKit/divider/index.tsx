import React from "react";
import "./styles.scss";

interface Props {
  title?: string;
}

export default class DividerComponent extends React.Component<Props> {
  render() {
    return (
      <div className="c-divider">
        <div />
        {this.props.title && (
          <React.Fragment>
            <h4>{this.props.title}</h4>
            <div />
          </React.Fragment>
        )}
      </div>
    );
  }
}
