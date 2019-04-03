import React from "react";
import "./style.scss";

export interface ThreeDotsProps {
  small: boolean;
  light: boolean;
  className?: string;
}

export default class ThreeDotsAnimated extends React.Component<ThreeDotsProps> {
  render() {
    let classNames = "dotsContainer";
    if (this.props.className) {
      classNames = classNames + " " + this.props.className;
    }

    let ballsClassName = "sp-3balls";
    if (this.props.light) {
      ballsClassName = ballsClassName + " sp-3balls-light";
    }

    return (
      <div className={classNames}>
        <div className={ballsClassName} />
      </div>
    );
  }
}
