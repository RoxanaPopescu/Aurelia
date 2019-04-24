import React from "react";
import "../styles.scss";
import "./styles.scss";
import { InputSize } from "../../input";
import { MultiSelect, OptionValue } from "react-selectize";
import Localization from "shared/src/localization";

export interface MultiSelectOption {
  label: string;
  labelNote?: string;
  // tslint:disable-next-line:no-any
  value: any;
}

export interface MultiSelectProps {
  placeholder: string;
  autofocus?: boolean;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: InputSize;
  values?: OptionValue[];
  addOptionText?: string;
  options?: MultiSelectOption[];
  error?: boolean;
  validate?: boolean;
  headline?: string;
  inlineHeadline?: boolean;
  onChange?: (values?: OptionValue[]) => void;
}

export interface MultiSelectState {
  disabled?: boolean;
  options?: MultiSelectOption[];
  selectedOptions?: OptionValue[];
  search: string;
  changed: boolean;
}

export default class MultiSelectComponent extends React.Component<
  MultiSelectProps,
  MultiSelectState
> {
  public static defaultProps: Partial<MultiSelectProps> = {
    disabled: false
  };
  select;
  constructor(props: MultiSelectProps) {
    super(props);
    this.state = {
      disabled: props.disabled,
      options: props.options,
      selectedOptions: props.values,
      search: "",
      changed: false
    };
  }

  componentWillReceiveProps(nextProps: MultiSelectProps) {
    this.setState({
      disabled: nextProps.disabled,
      options: nextProps.options,
      selectedOptions: nextProps.values
    });
  }

  getContainerClassNames() {
    let containerClassnames: string = "selectContainer multiSelectContainer";
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

  removeOption(option: OptionValue) {
    if (this.state.selectedOptions) {
      var newOptions = this.state.selectedOptions.filter(
        o => o.value !== option.value
      );

      this.setState({
        selectedOptions: newOptions
      });
      if (this.props.onChange) {
        this.props.onChange(newOptions);
      }
    }
  }

  renderAddLabel(query: string) {
    if (query === "") {
      return Localization.sharedValue("TypeToAdd");
    } else {
      return (
        <>
          <span className="addOptionIcon" />
          {this.props.addOptionText}
        </>
      );
    }
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
          <MultiSelect
            ref={select => {
              this.select = select;
            }}
            autofocus={this.props.autofocus}
            disabled={this.state.disabled || this.props.readonly}
            placeholder={this.props.placeholder}
            options={this.state.options}
            // tslint:disable-next-line:no-any
            onValuesChange={(options: any) => {
              this.setState({ selectedOptions: options });

              if (this.props.onChange) {
                this.props.onChange(options as OptionValue[]);
              }
            }}
            onBlur={e => this.onBlur()}
            values={this.state.selectedOptions}
            renderValue={option => {
              return (
                <div className="simple-value">
                  <span>{option.label}</span>
                  <div
                    className="removeButton"
                    onClick={() => this.removeOption(option)}
                  >
                    <span />
                    <span />
                  </div>
                </div>
              );
            }}
            restoreOnBackspace={item => {
              return item.label;
            }}
            onSearchChange={search => {
              this.setState({ search: search });
            }}
            createFromSearch={() => {
              if (
                this.props.addOptionText === undefined ||
                this.props.options !== undefined ||
                this.state.search === ""
              ) {
                // tslint:disable-next-line:no-any
                return null as any;
              }

              return {
                label: this.state.search,
                value: this.state.search
              } as OptionValue;
            }}
            renderNoResultsFound={(item, search) => {
              if (
                this.props.addOptionText &&
                this.props.options === undefined
              ) {
                return (
                  <div className="option-wrapper add-option">
                    <div className="simple-option">
                      {this.renderAddLabel(search)}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="no-results-found">
                    {Localization.sharedValue("NoResultsFound")}
                  </div>
                );
              }
            }}
            renderOption={
              // tslint:disable-next-line:no-any
              (arg$: any) => {
                var label, selectable, isSelectable, labelNote, newOption;
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
                      "simple-option " +
                      (isSelectable ? "" : "not-selectable") +
                      (!!newOption &&
                      this.props.options === undefined &&
                      this.props.addOptionText !== undefined
                        ? "add-option"
                        : "")
                    }
                  >
                    {!!newOption &&
                    this.props.options === undefined &&
                    this.props.addOptionText !== undefined
                      ? this.renderAddLabel(label)
                      : label}
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
