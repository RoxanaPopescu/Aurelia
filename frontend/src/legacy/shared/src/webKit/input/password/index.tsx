import React from "react";
import "./styles.scss";
import { default as Input, InputSize } from "../index";

export interface InputPasswordProps {
  name?: string;
  placeholder: string;
  value?: string;
  className?: string;
  id?: string;
  size?: InputSize;
  disabled?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  required?: boolean;
  autoComplete?: boolean;
  minlength?: number;
  maxlength?: number;
  error?: boolean;
  height?: string;
  // tslint:disable-next-line:no-any
  onChange(value?: any);
  onEnter?();
}

export interface InputPasswordState {
  showPassword: boolean;
  value?: string;
}

export default class InputPassword extends React.Component<
  InputPasswordProps,
  InputPasswordState
> {
  public static defaultProps: Partial<InputPasswordProps> = {
    required: true,
    autoComplete: false
  };

  constructor(props: InputPasswordProps) {
    super(props);
    this.state = {
      showPassword: false
    };
  }

  toggleShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  render() {
    return (
      <Input
        name={this.props.name}
        id={this.props.id}
        className={`passwordInput ${this.props.className}`}
        placeholder={this.props.placeholder}
        value={this.state.value}
        size={this.props.size}
        height={this.props.height}
        headline={this.props.headline}
        inlineHeadline={this.props.inlineHeadline}
        disabled={this.props.disabled}
        required={this.props.required}
        autoComplete={this.props.autoComplete}
        type={this.state.showPassword ? "text" : "password"}
        minlength={this.props.minlength}
        maxlength={this.props.maxlength}
        onEnter={this.props.onEnter}
        onChange={value => {
          this.setState({ value: value });
          this.props.onChange(value);
        }}
        children={
          <div
            className={
              this.state.showPassword
                ? "passwordToggle showPassword"
                : "passwordToggle"
            }
            onClick={() => this.toggleShowPassword()}
          />
        }
        error={this.props.error}
      />
    );
  }
}
