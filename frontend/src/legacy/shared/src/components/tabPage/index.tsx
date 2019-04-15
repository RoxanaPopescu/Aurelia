import React from "react";
import "./styles.scss";

interface Props {
  tabs?: { title: string; pageHeadline?: string }[];
  activeTab?: number;
  actionItems?: JSX.Element[];
  onChange?: (index: number) => void;
}

interface State {
  currentTabIndex: number;
}

export default class TabPageComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTabIndex: props.activeTab ? props.activeTab : 0
    };
  }

  private renderTabs() {
    let elements: JSX.Element[] = [];
    if (this.props.tabs === undefined) {
      for (var i = 0; i < 3; i++) {
        elements.push(
          <div key={`tab-skeleton-${i}`} className="c-tabPage-skeleton" />
        );
      }
    } else {
      elements = this.props.tabs.map((tab, index) => {
        return (
          <div
            key={tab.title}
            onClick={() => {
              this.setState({ currentTabIndex: index });
              if (this.props.onChange) {
                this.props.onChange(index);
              }
            }}
            className={"font-label-base c-tabPage-tab" +
              (index === this.state.currentTabIndex ? " active" : "") +
              (this.props.tabs!.length === 1 ? " c-tabPage-tab--single" : "")
            }
          >
            {tab.title}
          </div>
        );
      });

      if (this.props.actionItems !== undefined) {
        elements.push(
          <div key="actionContainer" className="c-tabPage-actionContainer">
            {this.props.actionItems}
          </div>
        );
      }
    }

    return <div className="c-tabPage-tabs">{elements}</div>;
  }

  render() {
    return (
      <div className="c-tabPage-outerContainer">
        {this.renderTabs()}
        <div
          className={`c-tabPage-contentContainer${
            !this.props.tabs ? " loading" : ""
          }`}
        >
          <div className="c-tabPage-content">
            {this.props.tabs && this.props.tabs[this.state.currentTabIndex].pageHeadline &&
            <div
              className={`c-tabPage-content-headline font-large${
                !this.props.tabs ? " loading" : ""
              }`}
            >
              {this.props.tabs[this.state.currentTabIndex].pageHeadline}
            </div>}
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
