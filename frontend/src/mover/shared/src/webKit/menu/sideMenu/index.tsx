import "./styles.scss";
import React from "react";
import { Route, Link } from "react-router-dom";
import { Icon } from "../..";

export interface SideMenuProps {
  sections: Section[];
  note?: string;
  userInformation: {
    name: { first: string; last?: string };
    outfitName: string;
    url: string;
    imageUrl?: string;
  };
}

export interface SideMenuState {
  hover: boolean;
  collapsed: boolean;
}

export interface Section {
  pages: Page[];
  title?: string;
}

export interface Page {
  text: string;
  url: string;
  notSelectable?: boolean;
  logo?: string;
  active?: boolean;
  subPages?: Page[];
}

export default class SideMenu extends React.Component<
  SideMenuProps,
  SideMenuState
> {
  // tslint:disable-next-line:no-any
  hoverTimeout: any;

  constructor(props: SideMenuProps) {
    super(props);
    this.state = {
      hover: false,
      collapsed: false
    };
  }

  renderSubPages(page: Page) {
    if (page.subPages === undefined) {
      return;
    }

    return (
      <div className="subLinkArea">
        {page.subPages.map((subPage, index) => {
          return (
            <Route
              key={"menuLink-" + index}
              path={subPage.url}
              children={({ match }) => {
                let className = "link";

                if (match) {
                  className += " active";
                }
                return (
                  <Link
                    to={subPage.url}
                    className={className}
                  >
                    {subPage.text}
                  </Link>
                );
              }}
            />
          );
        })}
      </div>
    );
  }

  renderSection(section: Section, sectionIndex: number) {
    return (
      <div
        className="sideMenuItemContainer"
        key={"menuSection" + "-" + sectionIndex}
      >
        {section.title && (
          <div className="menuSectionTitle">{section.title}</div>
        )}
        <ul>
          {section.pages.map((page, index) => {
            return (
              <Route
                key={"menuLink-" + index + "-" + sectionIndex}
                path={page.url}
                children={({ match }) => {
                  let active = false;

                  if (match && !page.notSelectable) {
                    active = true;
                  }
                  const hasSubMenu = page.subPages && page.subPages.filter(p => p.text).length > 1;
                  return (
                    <li className={`${active ? "active" : ""} ${hasSubMenu ? " menuLink--hasSubMenu" : ""}`}>
                      {page.subPages === undefined ? (
                        <Link
                          className="main-link"
                          to={page.url}
                          onClick={() => {
                            if (hasSubMenu) {
                              clearTimeout(this.hoverTimeout);
                              this.hoverTimeout = setTimeout(() => this.setState({ hover: true }), 300);
                            }
                          }}
                        >
                          <Icon name={page.logo} className="sideMenuIcons" />
                          {page.text}
                        </Link>
                      ) : (
                        <Link
                          className="main-link"
                          to={page.subPages[0].url}
                          onClick={() => {
                            clearTimeout(this.hoverTimeout);
                            if (hasSubMenu) {
                              this.hoverTimeout = setTimeout(() => this.setState({ hover: true }), 300);
                            }
                          }}
                        >
                          <Icon name={page.logo} className="sideMenuIcons" />
                          {page.text}
                        </Link>
                      )}
                      {this.renderSubPages(page)}
                    </li>
                  );
                }}
              />
            );
          })}
        </ul>
      </div>
    );
  }

  getAbbrevatedName() {
    if (this.props.userInformation.name.last === undefined) {
      return this.props.userInformation.name.first.substring(0, 2);
    } else {
      return (
        this.props.userInformation.name.first.substring(0, 1) +
        this.props.userInformation.name.last.substring(0, 1)
      );
    }
  }

  renderUserInformationButton() {
    return (
      <div className="c-sideMenu-profileShortcutContainer">
        <Link
          to={this.props.userInformation.url}
          className="c-sideMenu-profileShortcut"
        >
          <div className="c-sideMenu-profileShortcut-button-image">
            {this.props.userInformation.imageUrl ? (
              <img src={this.props.userInformation.imageUrl} />
            ) : (
              this.getAbbrevatedName()
            )}
          </div>
          <div className="c-sideMenu-profileShortcut-button-information">
            <h4 className="c-sideMenu-profileShortcut-button-information-name">
              {`${this.props.userInformation.name.first} ${this.props.userInformation.name.last}`}
            </h4>
            <h4 className="font-small">{this.props.userInformation.outfitName}</h4>
          </div>
        </Link>
      </div>
    );
  }

  render() {
    
    if (this.state.collapsed || window.innerWidth <= 1024) {
      document!.documentElement!.classList!.add("sideMenu--collapsed");
    } else {
      document!.documentElement!.classList!.remove("sideMenu--collapsed");
    }

    if (this.state.hover) {
      document!.documentElement!.classList!.add("sideMenu--hover");
    } else {
      document!.documentElement!.classList!.remove("sideMenu--hover");
    }

    return (
      <div className="applicationWrapper">
        <div
          className={"sideMenu dark"}
          onMouseEnter={() => {
            this.hoverTimeout = setTimeout(() => this.setState({ hover: true }), 1500);
          }}
          onMouseLeave={() => {
            clearTimeout(this.hoverTimeout);
            this.setState({ hover: false });
          }}
        >
          <div className="sideMenu-shadow"/>
          <div
            className="sideMenu-edge"
            onMouseDown={() => {
              this.setState({ collapsed: !this.state.collapsed });
            }}
          />
          <div className="c-sideMenu-topGradient"/>
          <div className="c-sideMenu-contentWrapper">
            <div className="c-sideMenu-content">
              {this.renderUserInformationButton()}
              {this.props.sections.map((section, index) =>
                this.renderSection(section, index)
              )}
              {this.props.note && (
                <div className="c-sideMenu-poweredBy">{this.props.note}</div>
              )}
            </div>
          </div>
        </div>
        <div className="mainContentWrapper">{this.props.children}</div>
      </div>
    );
  }
}
