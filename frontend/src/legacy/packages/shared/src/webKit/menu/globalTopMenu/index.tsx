import "./styles.scss";
import React from "react";
import { Link } from "react-router-dom";
import { Base } from "../../utillity/base";

export interface Props {
  logoUrls: { wide: string; narrow: string };
  rootPath: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  text: string;
  url: string;
}

export default class GlobalTopMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  renderMenuItems() {
    let array: JSX.Element[] = [];
    this.props.menuItems.map((menuItem, index) => {
      array.push(
        <div
          className="c-topMenu-profileShortCut-dropdown-menuItem"
          key={"menuItem-" + (index + 1)}
        >
          <Link to={menuItem.url} key={menuItem.text + menuItem.url}>
            {menuItem.text}
          </Link>
        </div>
      );
    });

    return array;
  }

  render() {
    return (
      <div className="globalTopMenu">
        <Link className="topMenuLogo wide" to={this.props.rootPath}>
          <img
            className="c-topMenu-logo"
            src={this.props.logoUrls.wide}
            style={{ height: Base.theme.logoHeight, marginLeft: Base.theme.logoLeft}}
          />
        </Link>
        <Link className="topMenuLogo narrow" to={this.props.rootPath}>
          <img
            className="c-topMenu-logo"
            src={this.props.logoUrls.narrow}
            style={{ height: Base.theme.logoHeight, marginLeft: Base.theme.logoLeft}}
          />
        </Link>
        <div className="c-topMenu-action">{this.props.children}</div>
      </div>
    );
  }
}
