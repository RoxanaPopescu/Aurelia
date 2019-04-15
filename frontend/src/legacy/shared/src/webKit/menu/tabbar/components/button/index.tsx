import React from "react";
import "./styles.scss";

interface Props {
  title: string;
  selected: boolean;
  disabled: boolean;
  index: number;
  onSelect(index: number);
}

export default class TabbarButtonComponent extends React.Component<Props> {
  render() {
    let classNames = "c-tabbar-button";
    if (this.props.selected) {
      classNames += " c-tabbar-buttonSelected";
    } else if (this.props.disabled) {
      classNames += " c-tabbar-buttonDisabled";
    } else {
      classNames += " c-tabbar-buttonNotSelected";
    }

    return (
      <a
        onClick={() => this.props.onSelect(this.props.index)}
        className={classNames}
      >
        {this.props.title}
      </a>
    );
  }
}
