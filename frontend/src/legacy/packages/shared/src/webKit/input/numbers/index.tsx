import React from "react";
import { default as Input } from "../";
import Validation from "../../utillity/validation";
import { InputSize } from "../index";

interface Props {
  name?: string;
  placeholder?: string;
  value?: number;
  disabled?: boolean;
  readonly?: boolean;
  noDisabledStyle?: boolean;
  headline?: string;
  size?: InputSize;
  inlineHeadline?: boolean;
  required?: boolean;
  autoComplete?: boolean;
  minlength?: number;
  maxlength?: number;
  className?: string;
  height?: string;
  id?: string;
  error?: boolean;
  valueDescription?: string;
  gridMode?: boolean;
  // tslint:disable-next-line:no-any
  onChange(value?: number, event?: any);
  onEnter?(value?: number);
}

interface State {
  value?: string;
}

export default class InputNumbers extends React.Component<Props, State> {
  static defaultProps = {
    required: true,
    autoComplete: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.value ? String(this.props.value) : undefined
    };
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      value: props.value ? String(props.value) : undefined
    });
  }

  valueChanged(value?: string) {
    if (value !== undefined) {
      if (Validation.numbersOnly(value)) {
        this.props.onChange(Number(value));
        this.setState({ value: value });
      } else {
        this.setState({ value: value.replace(/\D/g, "") });
      }
      if (this.props.maxlength && value.length > this.props.maxlength) {
        value = value.slice(0, -1);
        this.setState({ value: value });
        this.props.onChange(Number(value));
      }
    } else {
      this.props.onChange(value != null ? +value : undefined);
      this.setState({ value: value });
    }
  }

  render() {
    return (
      <Input
        onEnter={value => {
          if (this.props.onEnter) {
            this.props.onEnter(value);
          }
        }}
        name={this.props.name}
        noDisabledStyle={this.props.noDisabledStyle}
        placeholder={this.props.placeholder}
        readonly={this.props.readonly}
        value={this.state.value}
        headline={this.props.headline}
        inlineHeadline={this.props.inlineHeadline}
        disabled={this.props.disabled}
        size={this.props.size}
        required={this.props.required}
        autoComplete={this.props.autoComplete}
        type={"tel"}
        height={this.props.height}
        minlength={this.props.minlength}
        maxlength={this.props.maxlength}
        className={this.props.className}
        id={this.props.id}
        valueDescription={this.props.valueDescription}
        onChange={value => this.valueChanged(value)}
        error={this.props.error}
        gridMode={this.props.gridMode}
      />
    );
  }
}
