import "./styles.scss";
import React from "react";

export enum ButtonType {
  Action,
  Neutral,
  Light
}

export enum ButtonSize {
  Small,
  Medium,
  Large
}

export interface ButtonProps {
  type: ButtonType;
  size?: ButtonSize;
  className?: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?(event: React.MouseEvent<HTMLDivElement>);
}

export interface ButtonState {
  loading: boolean;
  type: ButtonType;
  disabled: boolean;
}

export class Button extends React.Component<ButtonProps, ButtonState> {
  static defaultProps = {
    loading: false
  };

  private buttonClass = ["buttonAction", "buttonNeutral", "buttonLight"];

  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      loading: props.loading || false,
      type: props.type,
      disabled: props.disabled ? true : false
    };
  }

  componentWillReceiveProps(nextProps: ButtonProps) {
    this.setState({
      loading: nextProps.loading || false,
      type: nextProps.type
    });

    if (nextProps.disabled !== undefined) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
  }

  // tslint:disable-next-line:no-any
  handleKeyPress(e: any) {
    if (e.key === "Enter") {
      e.target.click();
    }
  }
  render() {
    let containerClassNames =
      (this.props.size === ButtonSize.Large ? "buttonBig " : "") +
      (this.props.size === ButtonSize.Medium ? "buttonMedium " : "") +
      "buttonContainer moverButton" +
      (this.props.className ? " " + this.props.className : "") +
      (this.props.loading ? " loading" : "") +
      (this.state.disabled ? " disabled" : "");

    let textClassNames =
      "moverButtonText " +
      (this.props.size === undefined ? "font-label-base" : "") +
      (this.props.size === ButtonSize.Large ? "font-label-base" : "") +
      (this.props.size === ButtonSize.Medium ? "font-label-base" : "") +
      (this.props.size === ButtonSize.Small ? "font-label-small" : "");

    containerClassNames =
      containerClassNames + " " + this.buttonClass[this.props.type];

    return (
      <div
        id={this.props.id}
        onClick={event => {
          if (this.props.onClick) {
            this.props.onClick(event);
          }
        }}
        className={containerClassNames}
        onKeyPress={e => this.handleKeyPress(e)}
        tabIndex={0}
      >
        {this.state.loading === false && (
          <span className={textClassNames}>{this.props.children}</span>
        )}
      </div>
    );
  }
}
