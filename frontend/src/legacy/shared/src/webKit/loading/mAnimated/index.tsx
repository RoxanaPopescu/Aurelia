import React from "react";
import "./style.scss";

export interface MAnimatedProps {
  small: boolean;
  light: boolean;
  className?: string;
}

export default class MAnimated extends React.Component<MAnimatedProps> {
  render() {
    let src;
    if (this.props.light) {
      src = require("../../assets/images/mover/mLight.svg");
    } else {
      src = require("../../assets/images/mover/mDark.svg");
    }

    let classNames = "loadingImage";
    if (this.props.small) {
      classNames = classNames + " loadingImageSmall";
    }
    if (this.props.className) {
      classNames = classNames + " " + this.props.className;
    }

    return <img src={src} className={classNames} />;
  }
}
