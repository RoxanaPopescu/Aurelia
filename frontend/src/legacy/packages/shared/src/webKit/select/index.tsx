import React from "react";
import "./styles.scss";
import { SimpleSelect, OptionValue } from "react-selectize";
import { InputSize } from "../input";

export interface SelectOptionValue {
  label: string;
  labelNote?: string;
  // tslint:disable-next-line:no-any
  value: any;
}

export interface SelectProps {
  placeholder?: string;
  autofocus?: boolean;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: InputSize;
  options: SelectOptionValue[];
  defaultOptionsIndex?: number;
  // tslint:disable-next-line:no-any
  value?: any;
  error?: boolean;
  validate?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  onSelect(option?: OptionValue);
}

export interface SelectState {
  disabled?: boolean;
  defaultOptionsIndex?: number;
  // tslint:disable-next-line:no-any
  selectedOption: SelectOptionValue | undefined;
  options: SelectOptionValue[];
  changed: boolean;
}

export default class Select extends React.Component<SelectProps, SelectState> {
  select: SimpleSelect | null;

  constructor(props: SelectProps) {
    super(props);
    this.state = {
      disabled: props.disabled,
      options: props.options,
      defaultOptionsIndex: props.defaultOptionsIndex,
      selectedOption: props.options.find(o => o.value === props.value),
      changed: false
    };
  }

  componentWillReceiveProps(nextProps: SelectProps) {
    this.setState({
      disabled: nextProps.disabled,
      defaultOptionsIndex: nextProps.defaultOptionsIndex,
      options: nextProps.options,
      selectedOption: nextProps.options.find(o => o.value === nextProps.value)
    });
  }

  getSelectClassName() {
    let className: string = "";

    if (this.props.inlineHeadline) {
      className = " font-base";
    } else {
      if (this.props.size === "medium") {
        className = "inputDefault";
      } else if (this.props.size === "large") {
        className = "font-base";
      }
    }

    return className;
  }

  getContainerClassNames() {
    let containerClassnames: string = "selectContainer";
    if (this.props.className) {
      containerClassnames = containerClassnames + " " + this.props.className;
    }

    if (this.props.headline) {
      if (this.props.inlineHeadline) {
        containerClassnames += " inlineHeadline";
      } else {
        containerClassnames += " headline";
      }
    }
    if (this.props.readonly) {
      containerClassnames += " readOnly";
    }
    if (this.props.error) {
      containerClassnames += " error";
    }

    if (this.props.disabled) {
      containerClassnames += " disabled";
    }

    if (this.props.inlineHeadline) {
      containerClassnames += " selectLarge";
    } else {
      switch (this.props.size) {
        case "medium":
          containerClassnames += " selectMedium";
          break;
        case "large":
          containerClassnames += " selectLarge";
          break;
        default:
          containerClassnames += " selectSmall";
          break;
      }
    }

    return containerClassnames;
  }

  onBlur() {
    this.setState({ changed: true });
  }

  render() {
    return (
      <div className={this.getContainerClassNames()}>
        {this.props.headline && (
          <h4 className="selectHeadline font-heading">{this.props.headline}</h4>
        )}
        <div className="selectWrapper">
          <SimpleSelect
            ref={select => {
              this.select = select;
            }}
            delimiters={[9]} // Enables TAB to select the highlighted option
            autofocus={this.props.autofocus}
            disabled={this.props.readonly}
            defaultValue={
              this.state.defaultOptionsIndex !== undefined
                ? this.state.options[this.state.defaultOptionsIndex]
                : undefined
            }
            value={this.state.selectedOption}
            className={this.getSelectClassName()}
            placeholder={this.props.placeholder}
            options={this.state.options}
            onValueChange={value => {
              this.setState({
                selectedOption: value
              });
              this.props.onSelect(value);
            }}
            onBlur={e => this.onBlur()}
            renderValue={
              // tslint:disable-next-line:no-any
              (arg$: any) => {
                var label, labelNote;
                if (arg$ != null) {
                  (label = arg$.label), (labelNote = arg$.labelNote);
                }
                return (
                  <div className="simple-value ">
                    {label}
                    {labelNote && <div className="label-note">{labelNote}</div>}
                  </div>
                );
              }
            }
            renderOption={
              // tslint:disable-next-line:no-any
              (arg$: any) => {
                var label, newOption, selectable, isSelectable, labelNote;
                if (arg$ != null) {
                  (label = arg$.label),
                    (newOption = arg$.newOption),
                    (selectable = arg$.selectable),
                    (labelNote = arg$.labelNote);
                }
                isSelectable = typeof selectable === "undefined" || selectable;
                return (
                  <div
                    className={
                      "simple-option " + (isSelectable ? "" : "not-selectable")
                    }
                  >
                    {!!newOption ? "Add " + label + " ..." : label}
                    {labelNote && <span>{labelNote}</span>}
                  </div>
                );
              }
            }
          />
        </div>
      </div>
    );
  }
}
