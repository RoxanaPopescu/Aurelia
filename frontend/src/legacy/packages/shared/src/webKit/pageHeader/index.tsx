import "./styles.scss";
import React from "react";
import { Button, ButtonType } from "../button/index";
import { Link } from "react-router-dom";
import Input from "../input/index";
import { Icon } from "..";

export interface PageHeaderProps {
  search?: {
    placeholder: string;
    onChange(
      value: string | undefined,
      event: React.ChangeEvent<HTMLInputElement>
    );
    value: string | undefined;
  };
  linkBack?: { title: string; url: string };
  // tslint:disable-next-line:no-any
  tabs?: { title: string; key: any }[];
  // tslint:disable-next-line:no-any
  onSelectTab?(key: any);
  activeTab?: string;
}

export interface PageHeaderState {
  actionContainerOpenMobile: boolean;
  activeTab?: string;
  searchValue?: string;
}

export default class PageHeader extends React.Component<
  PageHeaderProps,
  PageHeaderState
> {
  constructor(props: PageHeaderProps) {
    super(props);
    this.state = {
      actionContainerOpenMobile: false,
      activeTab: props.activeTab
    };
  }

  componentWillReceiveProps(nextProps: PageHeaderProps) {
    if (nextProps.search && nextProps.search.value !== this.state.searchValue) {
      this.setState({
        searchValue: nextProps.search.value
      });
    } else if (nextProps.search == null) {
      this.setState({
        searchValue: undefined
      });
    }
  }

  toggleMobileButtonMenu() {
    let newValue = !this.state.actionContainerOpenMobile;
    this.setState({
      actionContainerOpenMobile: newValue
    });
  }

  renderChildren() {
    if (React.Children.toArray(this.props.children).length > 1) {
      return (
        <div
          className={
            this.state.actionContainerOpenMobile
              ? "c-pageHeader-actionOuterContainer open"
              : "c-pageHeader-actionOuterContainer"
          }
        >
          {this.props.linkBack && (
            <Link
              className="font-large c-pageHeader-linkBack"
              to={this.props.linkBack.url}
            >
              <Icon name="ico-arrow-backward-ios" />
              {this.props.linkBack.title}
            </Link>
          )}
          <Button
            className="c-pageHeader-mobileButton"
            onClick={() => {
              this.toggleMobileButtonMenu();
            }}
            type={ButtonType.Neutral}
          >
            Handlinger
            <img
              className="chevron"
              src={require("../assets/images/icons/chevronWhiteUp.svg")}
            />
          </Button>
          <div className="c-pageHeader-actionContainer">
            {this.props.children}
          </div>
        </div>
      );
    } else if (React.Children.toArray(this.props.children).length === 1) {
      return (
        <div className="c-pageHeader-actionOuterContainer">
          {this.props.linkBack && (
            <Link
              className="font-large c-pageHeader-linkBack"
              to={this.props.linkBack.url}
            >
              <Icon name="ico-arrow-backward-ios" />
              {this.props.linkBack.title}
            </Link>
          )}
          <div className="c-pageHeader-actionContainer">
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return;
    }
  }

  renderTabs() {
    if (this.props.tabs) {
      return (
        <div className="c-pageHeader-tabs font-label-base">
          {this.props.tabs.map((tab, index) => {
            let className: string = "c-pageHeader-tabs-tab";

            if (tab.key === this.state.activeTab) {
              className += " active";
            } else if (this.state.activeTab === undefined && index === 0) {
              this.setState({ activeTab: tab.key });
              className += " active";
            }
            return (
              <a
                key={tab.title + tab.key}
                className={className}
                onClick={() => {
                  this.setState({ activeTab: tab.key });
                  if (this.props.onSelectTab) {
                    this.props.onSelectTab(tab.key);
                  }
                }}
              >
                {tab.title}
              </a>
            );
          })}
        </div>
      );
    } else {
      return;
    }
  }

  renderSearch() {
    if (this.props.search) {
      return (
        <div className="c-pageHeader-search">
          <Input
            type={"search"}
            className="c-pageHeader-searchInput"
            size={"medium"}
            placeholder={this.props.search.placeholder}
            onChange={(value, event) => {
              this.setState({
                searchValue: value
              });
              this.props.search!.onChange(value, event);
            }}
            value={this.state.searchValue}
          />
        </div>
      );
    } else {
      return;
    }
  }

  getContainerClassName() {
    let className: string = "c-pageHeader";
    if (this.props.tabs) {
      className += " withTabs";
    }

    return className;
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        {this.props.children && this.renderChildren()}
        {this.renderSearch()}
        {this.renderTabs()}
      </div>
    );
  }
}
