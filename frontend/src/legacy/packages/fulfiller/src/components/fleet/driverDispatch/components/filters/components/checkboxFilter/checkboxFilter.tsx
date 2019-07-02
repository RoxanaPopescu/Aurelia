import React from "react";
import "./checkboxFilter.scss";
import { InputCheckbox, Input } from "shared/src/webKit";

interface Props {
  data: { label: string; value: string; checked?: boolean }[];
  onChange(checkedData: { label: string; value: string }[]);
}

interface State {
  collapsed: boolean;
  checkedData: { label: string; value: string; checked?: boolean }[];
  shownData: { label: string; value: string; checked?: boolean }[];
  query?: string;
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      collapsed: true,
      checkedData: props.data.filter(d => d.checked),
      shownData: props.data
    };
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      checkedData: props.data.filter(d => d.checked),
      shownData: props.data
    });
  }

  private renderToggle() {
    var classNames = "c-driverDispatch-filters-checkboxGroup-toggle";
    if (!this.state.collapsed) {
      classNames += " open";
    }
    return (
      <h4
        onClick={() => {
          this.setState({ collapsed: !this.state.collapsed });
        }}
        className={classNames}
      >
        {this.state.collapsed ? "Show more" : "Show less"}
        <span />
      </h4>
    );
  }

  render() {
    return (
      <>
        <Input
          headline="Name or id"
          placeholder="Type a name or id here"
          value={this.state.query}
          onEnter={() => {
            if (this.state.query) {
              var newCheckedData: {
                label: string;
                value: string;
                checked?: boolean;
              }[] = this.state.shownData.map(d => {
                return {
                  label: d.label,
                  value: d.value,
                  checked: true
                };
              });
              var checkedData = Array.from(
                new Set(newCheckedData.concat(this.state.checkedData))
              );

              this.setState({
                checkedData: checkedData
              });
              this.props.onChange(checkedData);
            } else {
              this.setState({
                shownData: this.props.data
              });
            }

            this.setState({ query: undefined, shownData: this.props.data });
          }}
          onChange={query => {
            if (query) {
              this.setState({
                shownData: this.props.data.filter(
                  c =>
                    c.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    c.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                )
              });
            } else {
              this.setState({
                shownData: this.props.data
              });
            }
            this.setState({
              query: query
            });
          }}
        />
        {this.state.shownData.length > 0 && (
          <div className="c-driverDispatch-filters-checkboxGroup">
            {this.state.shownData.map((data, i) => {
              if (this.state.collapsed && i > 4) {
                return false;
              }
              return (
                <InputCheckbox
                  key={data.value}
                  checked={
                    this.state.checkedData.filter(d => d.value === data.value)
                      .length > 0
                  }
                  onChange={checked => {
                    var checkedData: {
                      label: string;
                      value: string;
                      checked?: boolean;
                    }[] = [];
                    if (!checked) {
                      checkedData = this.state.checkedData.filter(
                        d => d.value !== data.value
                      );

                      this.setState({
                        checkedData: checkedData
                      });
                      this.props.onChange(checkedData);
                    } else {
                      checkedData = this.state.checkedData;
                      checkedData.push({
                        label: data.label,
                        value: data.value,
                        checked: true
                      });

                      this.setState({
                        checkedData: checkedData
                      });
                      this.props.onChange(checkedData);
                    }
                  }}
                >
                  {data.label}
                </InputCheckbox>
              );
            })}
            {this.state.shownData.length > 5 && this.renderToggle()}
          </div>
        )}
      </>
    );
  }
}
