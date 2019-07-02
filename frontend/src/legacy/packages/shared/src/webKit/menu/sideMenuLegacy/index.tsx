import "./styles.scss";
import React from "react";
import { Route, Link } from "react-router-dom";

export interface SideMenuLegacyProps {
  sections: Section[];
  rootPath: string;
  logoUrls: { desktop: string; mobile: string };
  note?: string;
}

export interface SideMenuLegacyState {
  mobileMenuActive: boolean;
}

export interface Section {
  pages: Page[];
  title?: string;
}

export interface Page {
  text: string;
  url: string;
  notSelectable?: boolean;
  exact?: boolean;
  logo?: string;
  active?: boolean;
  subPages?: Page[];
}

export default class SideMenuLegacy extends React.Component<
  SideMenuLegacyProps,
  SideMenuLegacyState
> {
  constructor(props: SideMenuLegacyProps) {
    super(props);
    this.state = {
      mobileMenuActive: false
    };
  }

  toggleMobileMenu() {
    let currentState = !this.state.mobileMenuActive;
    this.setState({
      mobileMenuActive: currentState
    });
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
                let className = "link font-small";

                if (match) {
                  className += " active";
                }
                return (
                  <Link
                    to={subPage.url}
                    className={className}
                    onClick={() => this.toggleMobileMenu()}
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
          <div className="list2 menuSectionTitle">{section.title}</div>
        )}
        <ul>
          {section.pages.map((page, index) => {
            return (
              <Route
                key={"menuLink-" + index + "-" + sectionIndex}
                path={page.url}
                exact={
                  page.exact === undefined && page.subPages === undefined
                    ? true
                    : page.exact
                }
                children={({ match }) => {
                  let active = false;

                  if (match && !page.notSelectable) {
                    active = true;
                  }
                  return (
                    <li className={active ? "active" : ""}>
                      {page.subPages === undefined ? (
                        <Link
                          className="font-base main-link"
                          to={page.url}
                          onClick={() => this.toggleMobileMenu()}
                        >
                          {page.text}
                          <img src={page.logo} className="sideMenuIcons" />
                        </Link>
                      ) : (
                        <Link className="font-base main-link" to={page.url}>
                          {page.text}
                          <img src={page.logo} className="sideMenuIcons" />
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

  render() {
    return (
      <div className="applicationWrapperLegacy">
        <div
          className={
            this.state.mobileMenuActive
              ? "sideMenuLegacy mobileMenuActive"
              : "sideMenuLegacy"
          }
        >
          <div
            className="mobileCloseOutside"
            onClick={() => this.toggleMobileMenu()}
          />
          <span
            className="mobileTrigger"
            onClick={() => this.toggleMobileMenu()}
          >
            <span />
            <span />
            <span />
            <span />
          </span>
          <Link
            className="sideMenuLogo"
            to={this.props.rootPath}
            onClick={() => this.toggleMobileMenu()}
            style={{
              backgroundImage: "url(" + this.props.logoUrls.desktop + ")"
            }}
          />
          <Link
            className="sideMenuLogo mobile"
            to={this.props.rootPath}
            onClick={() => this.toggleMobileMenu()}
            style={{
              backgroundImage: "url(" + this.props.logoUrls.mobile + ")"
            }}
          />
          {this.props.sections.map((section, index) =>
            this.renderSection(section, index)
          )}
          {this.props.note && <div className="menuNote">{this.props.note}</div>}
        </div>
        <div className="mainContentWrapper">{this.props.children}</div>
      </div>
    );
  }
}
