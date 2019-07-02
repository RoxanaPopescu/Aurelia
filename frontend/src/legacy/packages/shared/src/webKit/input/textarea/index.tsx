import React from "react";
import "./styles.scss";
import TextareaAutosize from "react-autosize-textarea";
import { InputSize } from "../index";

export interface InputTextareaProps {
  name?: string;
  size?: InputSize;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  rows?: number;
  id?: string;
  maxRows?: number;
  required?: boolean;
  autoComplete?: boolean;
  maxlength?: number;
  className?: string;
  error?: boolean;
  minHeight?: number;
  onChange(value?: string);
}

export interface InputTextareaState {
  value?: string;
}

export default class InputTextarea extends React.Component<
  InputTextareaProps,
  InputTextareaState
> {
  public static defaultProps: Partial<InputTextareaProps> = {
    required: true,
    autoComplete: false
  };

  constructor(props: InputTextareaProps) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(nextProps: InputTextareaProps) {
    this.setState({ value: nextProps.value });
  }

  onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let value = event.target.value;

    if (
      (this.props.maxlength && value.length <= this.props.maxlength) ||
      !this.props.maxlength
    ) {
      this.setState({
        value: event.target.value
      });

      this.props.onChange(value);
    }
  }

  getSelectClassName() {
    let className: string;

    if (this.props.inlineHeadline) {
      className = " font-base";
    } else {
      switch (this.props.size) {
        case "medium":
          className = "inputDefault";
          break;
        case "large":
          className = "font-base";
          break;
        default:
          className = "list1";
          break;
      }
    }

    if (this.props.error) {
      className += " error";
    }

    return className;
  }

  render() {
    let containerClassnames = "textareaContainer";
    if (this.props.className) {
      containerClassnames += " " + this.props.className;
    }
    if (this.props.error) {
      containerClassnames += " error";
    }
    if (this.props.headline) {
      if (this.props.inlineHeadline) {
        containerClassnames += " inlineHeadline";
      } else {
        containerClassnames += " headline";
      }
    }

    // tslint:disable-next-line:no-any
    let styles: any = undefined;
    if (this.props.minHeight) {
      styles = { minHeight: this.props.minHeight };
    }

    return (
      <div className={containerClassnames} id={this.props.id}>
        {this.props.headline && (
          <h4 className="textareaHeadline inputHeadline font-large">{this.props.headline}</h4>
        )}
        <div className="textareaWrapper">
          <TextareaAutosize
            name={this.props.name}
            placeholder={this.props.placeholder}
            onChange={e => this.onChange(e)}
            disabled={this.props.disabled}
            readOnly={this.props.readonly}
            value={this.state.value}
            required={this.props.required}
            rows={this.props.rows}
            maxRows={this.props.maxRows}
            style={styles}
            autoComplete={this.props.autoComplete ? "on" : "off"}
            className={this.getSelectClassName()}
          />
          {this.props.maxlength && (
            <h4 className="wordCount list1">
              {(this.state.value ? this.state.value.length : 0) +
                "/" +
                this.props.maxlength}
            </h4>
          )}
        </div>
      </div>
    );
  }
}
