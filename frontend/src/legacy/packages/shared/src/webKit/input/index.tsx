import React from "react";
import "./styles.scss";

export interface InputProps {
  name?: string;
  placeholder?: string;
  size?: InputSize;
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  noDisabledStyle?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  type?: InputTypes;
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
  onChange(value: any | undefined, event: React.ChangeEvent<HTMLInputElement>);
  // tslint:disable-next-line: no-any
  onEnter?(value: any | undefined);
}

export interface InputState {
  value?: string;
  error?: boolean;
}

export type InputSize = "small" | "medium" | "large";

export type InputTypes =
  | "text"
  | "email"
  | "number"
  | "tel"
  | "password"
  | "search";

export default class Input extends React.Component<InputProps, InputState> {
  public static defaultProps: Partial<InputProps> = {
    type: "text",
    required: true,
    gridMode: false
  };

  public input: HTMLInputElement;

  constructor(props: InputProps) {
    super(props);
    this.state = {
      value: props.value,
      error: props.error
    };
  }

  validate() {
    if (this.state.value) {
      if (
        (this.props.maxlength &&
          this.state.value.length > this.props.maxlength) ||
        (this.props.minlength && this.state.value.length < this.props.minlength)
      ) {
        this.setState({
          error: true
        });
      }
    } else {
      if (this.props.required) {
        this.setState({
          error: true
        });
      }
    }
  }

  componentWillReceiveProps(nextProps: InputProps) {
    this.setState({
      value: nextProps.value,
      error: nextProps.error
    });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    let returnValue: string | undefined;
    if (event.target.value) {
      if (event.target.value === "") {
        returnValue = undefined;
      } else {
        returnValue = event.target.value;
      }
    } else {
      returnValue = undefined;
    }

    this.setState({ value: event.target.value });
    this.props.onChange(returnValue, event);
  }

  getInputClassName() {
    var className: string = "";

    if (this.props.name) {
      className += " " + this.props.name;
    }

    if (this.props.noDisabledStyle) {
      className += " noDisabledStyle";
    }

    if (this.props.gridMode) {
      className += " noBorder";
    }

    if (
      this.state.value &&
      this.props.valueDescription &&
      this.props.gridMode === true
    ) {
      className += " inputWithContainer";
    }

    return className;
  }

  getContainerClassNames() {
    let containerClassnames = "inputContainer";
    if (this.props.className) {
      containerClassnames += " " + this.props.className;
    }
    if (this.state.error) {
      containerClassnames += " error";
    }
    if (this.props.readonly) {
      containerClassnames += " readOnly";
    }
    if (this.props.headline) {
      if (this.props.inlineHeadline) {
        containerClassnames += " inlineHeadline";
      } else {
        containerClassnames += " headline";
      }
    }

    if (this.props.gridMode) {
      containerClassnames += " gridMode";
    }

    if (this.props.inlineHeadline) {
      containerClassnames += " inputLarge";
    } else {
      switch (this.props.size) {
        case "medium":
          containerClassnames += " inputMedium";
          break;
        case "large":
          containerClassnames += " inputLarge";
          break;
        // InputSizes.Small and undefined defaults to this
        default:
          containerClassnames += " inputSmall";
          break;
      }
    }

    return containerClassnames;
  }

  render() {
    return (
      <div
        className={this.getContainerClassNames()}
        style={{
          height:
            this.props.height && this.props.headline === undefined
              ? this.props.height
              : undefined
        }}
      >
        {this.props.headline && (
          <h4 className="inputHeadline font-heading">{this.props.headline}</h4>
        )}
        <div className="inputWrapper">
          <input
            name={this.props.name}
            id={this.props.id}
            placeholder={this.props.placeholder}
            readOnly={this.props.readonly}
            onChange={e => this.onChange(e)}
            disabled={this.props.disabled}
            maxLength={this.props.maxlength}
            minLength={this.props.minlength}
            type={this.props.type}
            value={this.state.value !== undefined ? this.state.value : ""}
            required={this.props.required}
            autoComplete={
              this.props.autoComplete === undefined
                ? undefined
                : this.props.autoComplete
                  ? "on"
                  : "off"
            }
            className={this.getInputClassName()}
            onKeyPress={event => {
              if (this.props.onEnter && event && event.key === "Enter") {
                this.props.onEnter(this.state.value);
              }
            }}
            style={{
              height: this.props.height ? this.props.height : undefined
            }}
            ref={input => {
              this.input = input!; /*this.props.ref(this.input);*/
            }}
          />
          {this.state.value &&
            this.props.valueDescription &&
            this.props.gridMode === false && (
              <div className="valueDescriptionContainer inputDefault">
                {this.state.value}
                <span className="valueDescriptionWidth">
                  {this.props.valueDescription}
                </span>
                <div className="valueDescription">
                  {this.props.valueDescription}
                </div>
              </div>
            )}
          {this.state.value &&
            this.props.valueDescription &&
            this.props.gridMode === true && (
              <div className="valueDescriptionContainer inputDefault">
                <div className="valueDescription">
                  {this.props.valueDescription}
                </div>
              </div>
            )}
          {this.props.children}
        </div>
      </div>
    );
  }
}
