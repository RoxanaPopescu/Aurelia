import React from "react";
import "./styles.scss";
import "../styles.scss";
import { SimpleSelect, OptionValue, SimpleSelectEvent } from "react-selectize";
import { InputSize } from "../../input";

export interface OptionGroup {
  headline: string;
  options: Option[];
}

export interface Option {
  mainText: string;
  secondaryText?: string;
  // tslint:disable-next-line:no-any
  data?: any;
}

export interface RemoteSelectProps {
  placeholder: string;
  defaultTexts: { noResult: string; emptySearch: string };
  optionGroups?: OptionGroup[];
  autofocus?: boolean;
  size?: InputSize;
  headline?: string;
  iconUrl?: string;
  inlineHeadline?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  validate?: boolean;
  defaultOptions?: OptionGroup[];
  value?: OptionValue;
  onFocus?(event: SimpleSelectEvent);
  onSearchChange?(query?: string);
  onChange?(data?: Option);
  // tslint:disable-next-line:no-any
  ref?(select?: any);
}

export interface RemoveSelectState {
  changed: boolean;
  search?: string;
}

export default class RemoteSelect extends React.Component<
  RemoteSelectProps,
  RemoveSelectState
> {
  constructor(props: RemoteSelectProps) {
    super(props);
    this.state = {
      changed: false,
      search: props.value ? props.value.label : undefined
    };
  }

  noResultsFound(query: string, value?: OptionValue) {
    if (query === undefined || query.length === 0) {
      return (
        <div className="no-results-found">
          {this.props.defaultTexts.emptySearch}
        </div>
      );
    } else if (query.length > 0) {
      return (
        <div className="no-results-found">
          {this.props.defaultTexts.noResult}
        </div>
      );
    } else {
      return <div />;
    }
  }

  renderOption(option: OptionValue) {
    if (option.value === "header") {
      return <div className="optionHeader font-large">{option.label}</div>;
    }

    return (
      <div className="option simple-option">
        <div className="text-container">
          <div className="main-text cta4">{option.value.mainText}</div>
          <div className="secondary-text">{option.value.secondaryText}</div>
        </div>
      </div>
    );
  }

  mapOptions() {
    // tslint:disable-next-line:no-any
    let correctedOptions: any = [];
    if (this.props.optionGroups) {
      this.props.optionGroups.forEach(optionGroup => {
        correctedOptions.push({
          label: optionGroup.headline,
          value: "header",
          selectable: false,
          key: "header" + optionGroup.headline
        });
        optionGroup.options.map(option => {
          correctedOptions.push({
            label: option.mainText,
            value: option,
            key: option.mainText
          });
        });
      });
    }

    return correctedOptions;
  }

  getContainerClassName() {
    let containerClassnames: string = "selectContainer remoteSelectContainer";

    if (this.props.className) {
      containerClassnames += " " + this.props.className;
    }
    if (this.props.error) {
      containerClassnames += " error";
    }

    if (this.props.disabled) {
      containerClassnames += " readOnly disabled";
    }

    if (this.props.headline) {
      if (this.props.inlineHeadline) {
        containerClassnames += " inlineHeadline";
      } else {
        containerClassnames += " headline";
      }
    }

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

    return containerClassnames;
  }

  getSelectClassName() {
    let className: string;

    switch (this.props.size) {
      case "medium":
        className = "inputDefault";
        break;
      case "large":
        className = "font-base";
        break;
      // InputSizes.Small and undefined defaults to this
      default:
        className = "list1";
        break;
    }

    return className;
  }

  onBlur() {
    this.setState({ changed: true });
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        {this.props.headline && (
          <h4 className="selectHeadline font-heading">{this.props.headline}</h4>
        )}
        <div
          className="selectWrapper remote-select-input"
          onClick={() => {
            /* */
          }}
        >
          {this.props.iconUrl && (
            <div
              className="icon"
              style={{ backgroundImage: "url(" + this.props.iconUrl + ")" }}
            />
          )}
          <SimpleSelect
            autofocus={this.props.autofocus}
            delimiters={[9]} // Enables TAB to select the highlighted option
            editable={item => {
              return item.label;
            }}
            renderValue={item => {
              return (
                <div className="simple-value">
                  {item.value.mainText}
                  {item.value.secondaryText && [
                    ", ",
                    <span key="secondaryText" className="inactive">
                      {item.value.secondaryText}
                    </span>
                  ]}
                </div>
              );
            }}
            disabled={this.props.disabled}
            className={this.getSelectClassName()}
            placeholder={this.props.placeholder}
            ref={select => {
              if (this.props.ref) {
                this.props.ref(select);
              }
            }}
            search={this.state.search ? this.state.search : ""}
            onSearchChange={query => {
              this.setState({
                search: query
              });
              if (this.props.onSearchChange) {
                this.props.onSearchChange(
                  query.length === 0 ? undefined : query
                );
              }
            }}
            value={this.props.value}
            onFocus={event => this.props.onFocus && this.props.onFocus(event)}
            onBlur={e => this.onBlur()}
            onValueChange={optionValue => {
              this.setState({
                search: optionValue ? optionValue.label : undefined
              });
              if (!optionValue && this.props.onChange) {
                this.props.onChange();
              }
              if (optionValue && optionValue.value && this.props.onChange) {
                this.props.onChange(optionValue.value);
              }
            }}
            renderOption={item => this.renderOption(item)}
            filterOptions={options => {
              return options;
            }}
            renderNoResultsFound={(value, search) =>
              this.noResultsFound(search, value)
            }
            options={this.mapOptions()}
          />
        </div>
      </div>
    );
  }
}
