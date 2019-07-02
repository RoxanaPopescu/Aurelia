import "./styles.scss";
import React from "react";

export interface PageContentProps {
  tablePage?: boolean;
  tabPage?: boolean;
  className?: string;
}

export interface PageContentState {
  tablePage: boolean;
}

export default class PageContent extends React.Component<
  PageContentProps,
  PageContentState
> {
  constructor(props: PageContentProps) {
    super(props);
    this.state = {
      tablePage: props.tablePage ? props.tablePage : false
    };
  }

  componentWillReceiveProps(nextProps: PageContentProps) {
    this.setState({
      tablePage: nextProps.tablePage ? nextProps.tablePage : false
    });
  }
  getClassNames() {
    let classNames = "c-pageContent";
    if (this.state.tablePage) {
      classNames += " tablePage";
    }
    if (this.props.tabPage) {
      classNames += " tabPage";
    }

    if (this.props.className) {
      classNames += " " + this.props.className;
    }

    return classNames;
  }

  render() {
    return (
      <div className={this.getClassNames()}>
        <div className="c-pageContent-innerWrapper">{this.props.children}</div>
      </div>
    );
  }
}
