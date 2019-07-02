import React from "react";
import "./style.scss";
import Localization from "shared/src/localization";

export interface ErrorInlineProps {
  title?: string;
  description?: string;
  customIcon?: string;
}

export default class ErrorInline extends React.Component<ErrorInlineProps> {
  renderButtons() {
    if (this.props.children) {
      return <div className="buttons-container">{this.props.children}</div>;
    } else {
      return undefined;
    }
  }

  render() {
    const title = this.props.title || Localization.sharedValue("Error_General");
    return (
      <div className="error-component">
        {this.props.customIcon && (
          <div className="icon-container">
            <img src={this.props.customIcon} />
          </div>
        )}
        <div className="text-container">
          <div className="font-large">{title}</div>
          {this.props.description && this.props.description !== title && (
            <div className="text font-base">{this.props.description}</div>
          )}
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}
