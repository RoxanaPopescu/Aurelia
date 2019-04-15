import React from "react";
import "./styles.scss";

interface Props {
  title: string;
  content: string;
}

export default class ItemComponent extends React.Component<Props> {
  render() {
    return (
      <div className="c-routePlanSettings-listElement-ItemContainer">
        <div className="c-routePlanSettings-listElement-ItemContainer-Title font-label-base">
          {this.props.title}
        </div>
        <div className="c-routePlanSettings-listElement-ItemContainer-Content font-small">
          {this.props.content}
        </div>
      </div>
    );
  }
}
