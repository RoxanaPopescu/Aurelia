import React from "react";
import "./styles.scss";

interface Props {
  title: string;
  description: string;
}

export default class RoutePlanningHeaderItemComponent extends React.Component<
  Props
> {
  render() {
    return (
      <div className="c-routePlanning-headerItem">
        <div className="c-routePlanning-headerItem-title font-small">
          {this.props.title}
        </div>
        <div className="c-routePlanning-headerItem-description font-small">
          {this.props.description}
        </div>
      </div>
    );
  }
}
