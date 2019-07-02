import React from "react";
import "./styles.scss";
import TabbarButtonComponent from "./components/button/index";

interface Props {
  items: TabbarItem[];
  initialSelectedIndex?: number;
}

interface State {
  selectedIndex: number;
}

export interface TabbarItem {
  title: string;
  component: JSX.Element;
  disabled?: boolean;
  key: string;
}

export default class TabBarComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let selectedIndex: number;
    if (props.initialSelectedIndex) {
      selectedIndex = props.initialSelectedIndex;
    } else {
      if (window.location.hash && window.location.hash.length > 1) {
        let hashKey = window.location.hash.replace("#", "");

        let found: number | undefined;
        for (let i = 0; i < props.items.length; i++) {
          let item = props.items[i];
          if (item.key === hashKey) {
            found = i;
            break;
          }
        }

        if (found) {
          selectedIndex = found;
        } else {
          selectedIndex = 0;
        }
      } else {
        selectedIndex = 0;
      }
    }
    this.state = { selectedIndex: selectedIndex };
  }

  render() {
    return (
      <div className="c-tabbar-outerContainer">
        <div className="c-tabbar-container">
          <div className="c-tabbar-buttonContainer">
            {this.props.items.map((item, index) => (
              <TabbarButtonComponent
                key={item.title}
                onSelect={selectedIndex => {
                  this.setState({ selectedIndex: selectedIndex });
                  window.location.hash =
                    "#" + this.props.items[selectedIndex].key;
                }}
                index={index}
                selected={this.state.selectedIndex === index}
                title={item.title}
                disabled={!!item.disabled}
              />
            ))}
          </div>
          <div className="c-tabbar-contentContainer">
            {this.props.items[this.state.selectedIndex].component}
          </div>
        </div>
      </div>
    );
  }
}
