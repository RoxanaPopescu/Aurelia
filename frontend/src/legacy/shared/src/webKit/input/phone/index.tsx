import React from "react";
import { default as Input } from "../";
import Validation from "../../utillity/validation";
import { InputSize } from "../index";

export interface InputPhoneProps {
  name?: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  required?: boolean;
  autoComplete?: boolean;
  minlength?: number;
  maxlength?: number;
  className?: string;
  size?: InputSize;
  id?: string;
  error?: boolean;
  // tslint:disable-next-line:no-any
  onChange(value?: any);
  onEnter?();
}

export interface InputPhoneState {
  value?: string;
}

export default class InputPhone extends React.Component<
  InputPhoneProps,
  InputPhoneState
> {
  public static defaultProps: Partial<InputPhoneProps> = {
    required: true,
    autoComplete: false
  };

  constructor(props: InputPhoneProps) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps: InputPhoneProps) {
    this.setState({ value: nextProps.value });
  }

  valueChanged(value?: string) {
    if (value !== undefined) {
      if (Validation.numbersOnly(value)) {
        this.props.onChange(value);
        this.setState({ value: value });
      } else {
        this.setState({ value: value.replace(/\D/g, "") });
      }
      if (this.props.maxlength && value.length > this.props.maxlength) {
        value = value.slice(0, -1);
        this.setState({ value: value });
        this.props.onChange(value);
      }
    } else {
      this.props.onChange(value);
      this.setState({ value: value });
    }
  }

  render() {
    return (
      <Input
        onEnter={this.props.onEnter}
        name={this.props.name}
        placeholder={this.props.placeholder}
        size={this.props.size}
        value={this.state.value}
        headline={this.props.headline}
        inlineHeadline={this.props.inlineHeadline}
        disabled={this.props.disabled}
        required={this.props.required}
        autoComplete={this.props.autoComplete}
        type={"tel"}
        minlength={this.props.minlength}
        maxlength={this.props.maxlength}
        className={this.props.className}
        id={this.props.id}
        onChange={value => this.valueChanged(value)}
        error={this.props.error}
      />
    );
  }
}
