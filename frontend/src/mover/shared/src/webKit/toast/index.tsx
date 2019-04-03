import React from "react";
import "./style.scss";

export interface ToastProps {
  type: ToastType;
  remove();
}

export enum ToastType {
  Alert,
  Success,
  Warning
}

export default class Toast extends React.Component<ToastProps> {
  constructor(props: ToastProps) {
    super(props);

    this.countDown();
  }

  countDown() {
    setTimeout(() => {
      this.props.remove();
    }, 10000);
  }

  getToastCssClass() {
    var className = "c-toast";

    // tslint:disable-next-line:switch-default
    switch (this.props.type) {
      case ToastType.Success:
        className += " success";
        break;
      case ToastType.Alert:
        className += " alert";
        break;
      case ToastType.Warning:
        className += " warning";
        break;
    }

    return className;
  }

  render() {
    return (
      <div className={this.getToastCssClass()}>
        <div className="c-toast-icon" />
        <div className="font-small c-toast-message">
          {this.props.children}
          <div className="c-toast-close" onClick={() => this.props.remove()} />
        </div>
      </div>
    );
  }
}
