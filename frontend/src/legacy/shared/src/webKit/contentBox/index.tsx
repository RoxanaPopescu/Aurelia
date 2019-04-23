import "./styles.scss";
import React from "react";
import LoadingOverlay from "../loading/overlay/index";

export interface ContentBoxProps {
  title: String;
  loading?: boolean;
  className?: string;
  showClose?: boolean;
  onClose?();
}

export interface ContentBoxState {
  loading: boolean;
}

export default class ContentBox extends React.Component<
  ContentBoxProps,
  ContentBoxState
> {
  constructor(props: ContentBoxProps) {
    super(props);
    this.state = {
      loading: this.props.loading ? true : false
    };
  }

  componentWillReceiveProps(nextProps: ContentBoxProps) {
    this.setState({ loading: nextProps.loading ? true : false });
  }

  render() {
    let classNames = "c-contentBox";
    if (this.props.className) {
      classNames += " " + this.props.className;
    }

    return (
      <div className={classNames}>
        <div className="font-larger title">{this.props.title}</div>
        <div className="content">{this.props.children}</div>
        {this.state.loading && <LoadingOverlay />}
      </div>
    );
  }
}
