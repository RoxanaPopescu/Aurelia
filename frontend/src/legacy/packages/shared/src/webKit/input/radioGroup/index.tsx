import React from "react";
import "./styles.scss";

export interface InputRadioGroupProps {
  // tslint:disable-next-line:no-any
  radioButtons: { value: any; headline: string }[];
  // tslint:disable-next-line:no-any
  checkedValue: any;
  name?: string;
  id?: string;
  small?: boolean;
  className?: string;
  required?: boolean;
  // tslint:disable-next-line:no-any
  disabledValues?: any[];
  // tslint:disable-next-line:no-any
  onChange(value: any);
}

export interface InputRadioGroupState {
  // tslint:disable-next-line:no-any
  checkedValue: any;
}

interface RadioProps {
  name?: string;
  value: string;
  id?: string;
  headline: string;
  checked: boolean;
  // tslint:disable-next-line:no-any
  toggle: any;
  required?: boolean;
  disabled?: boolean;
}

interface RadioStates {
  checked: boolean;
}

class Radio extends React.Component<RadioProps, RadioStates> {
  constructor(props: RadioProps) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
  }

  componentWillReceiveProps(nextProps: RadioProps) {
    this.setState({ checked: nextProps.checked });
  }

  render() {
    let classNames = this.props.checked
      ? "radioLabel font-base checked"
      : "radioLabel font-base";
    if (this.props.disabled) {
      classNames += " disabled";
    }

    return (
      <label
        id={this.props.id}
        htmlFor={this.props.name}
        className={classNames}
        onClick={() => this.props.toggle()}
      >
        <div className="radioButton" />
        <input
          name={this.props.name}
          value={this.props.value}
          required={this.props.required}
          type="radio"
          readOnly={true}
          checked={this.props.checked}
          disabled={this.props.disabled}
        />
        {this.props.headline}
      </label>
    );
  }
}

export default class InputRadioGroup extends React.Component<
  InputRadioGroupProps,
  InputRadioGroupState
> {
  public static defaultProps: Partial<InputRadioGroupProps> = {
    required: true,
    small: false
  };

  constructor(props: InputRadioGroupProps) {
    super(props);
    this.state = {
      checkedValue: this.props.checkedValue
    };
  }

  componentWillReceiveProps(nextProps: InputRadioGroupProps) {
    this.setState({ checkedValue: nextProps.checkedValue });
  }

  // tslint:disable-next-line:no-any
  onChange(value: any) {
    this.setState({
      checkedValue: value
    });

    this.props.onChange(value);
  }

  render() {
    let containerClassnames: string = "radioGroup";

    if (this.props.className) {
      containerClassnames = containerClassnames + " " + this.props.className;
    }

    if (this.props.small) {
      containerClassnames = containerClassnames + " radioSmall";
    }

    return (
      <div className={containerClassnames} id={this.props.id}>
        {this.props.radioButtons.map(radioButton => {
          let disabled = false;
          if (this.props.disabledValues) {
            disabled = radioButton.value === this.state.checkedValue;
          }

          return (
            <Radio
              id={"radio-" + radioButton.value}
              key={radioButton.value}
              headline={radioButton.headline}
              required={this.props.required}
              name={this.props.name}
              value={radioButton.value}
              checked={radioButton.value === this.state.checkedValue}
              toggle={() => this.onChange(radioButton.value)}
              disabled={disabled}
            />
          );
        })}
      </div>
    );
  }
}
