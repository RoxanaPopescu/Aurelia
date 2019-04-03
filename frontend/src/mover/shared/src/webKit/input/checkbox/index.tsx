import React from "react";
import "./styles.scss";

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  error?: boolean;
  readonly?: boolean;
  onChange?(checked: boolean);
}

export interface CheckboxState {
  checked: boolean;
}

export default class InputCheckbox extends React.Component<
  CheckboxProps,
  CheckboxState
> {
  constructor(props: CheckboxProps) {
    super(props);
    this.state = {
      checked: this.props.checked === undefined ? false : this.props.checked
    };
  }

  componentWillReceiveProps(nextProps: CheckboxProps) {
    if (nextProps.checked !== undefined) {
      this.setState({ checked: nextProps.checked });
    }
  }

  render() {
    let labelClassName: string = "c-checkboxContainer";

    if (this.props.error) {
      labelClassName += " error";
    }

    if (this.props.className) {
      labelClassName += " " + this.props.className;
    }

    if (this.props.readonly) {
      labelClassName += " readOnly";
    }

    if (this.state.checked) {
      labelClassName += " checked";
    }

    return (
      <div
        className={labelClassName}
        onClick={event => {
          if (!this.props.readonly) {
            if (this.props.onChange) {
              this.props.onChange(!this.state.checked);
            }
            this.setState({ checked: !this.state.checked });
          }
          event.stopPropagation();
        }}
      >
        <span className="c-checkbox">{this.state.checked && <span />}</span>
        <div className="c-checkboxContainer-content">{this.props.children}</div>
      </div>
    );
  }
}
