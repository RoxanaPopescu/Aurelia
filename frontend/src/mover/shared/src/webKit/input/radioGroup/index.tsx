import React from "react";
import "./styles.scss";

export interface InputRadioGroupProps {
  // tslint:disable-next-line:no-any
  radioButtons: { value: any; headline: string }[];
  checkedIndex: number;
  name?: string;
  id?: string;
  small?: boolean;
  className?: string;
  required?: boolean;
  disabledIndexes?: number[];
  onChange(index: number);
}

export interface InputRadioGroupState {
  checkedIndex: number;
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
      checkedIndex: this.props.checkedIndex
    };
  }

  componentWillReceiveProps(nextProps: InputRadioGroupProps) {
    this.setState({ checkedIndex: nextProps.checkedIndex });
  }

  onChange(index: number) {
    this.setState({
      checkedIndex: index
    });

    this.props.onChange(index);
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
        {this.props.radioButtons.map((radioButton, index) => {
          let disabled = false;
          if (this.props.disabledIndexes) {
            disabled = this.props.disabledIndexes.indexOf(index) > -1;
          }

          return (
            <Radio
              id={"radio" + index}
              key={index}
              headline={radioButton.headline}
              required={this.props.required}
              name={this.props.name}
              value={radioButton.value}
              checked={index === this.state.checkedIndex}
              toggle={() => this.onChange(index)}
              disabled={disabled}
            />
          );
        })}
      </div>
    );
  }
}
