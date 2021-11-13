import React from "react";
import "./styles.scss";
import { RoutePlanningStore } from "../../store";

interface Props {
  store: RoutePlanningStore;
}

export default class RoutePlanningScaleComponent extends React.Component<
  Props
> {
  render() {
    return (
      <div className="c-routePlanning-routes-list-headerActions">
        <div
          className="c-routePlanning-routes-action"
          onClick={() => {
            if (this.props.store.timeScale < 1) {
              this.props.store.timeScale += 0.2;
            } else {
              this.props.store.timeScale *= 1.2;
            }
          }}
        >
          <img src={require("./assets/plus.png")} />
        </div>
        &nbsp;
        <div
          className="c-routePlanning-routes-action"
          onClick={() => {
            if (this.props.store.timeScale > 0.5) {
              this.props.store.timeScale -= 0.2;
            }
          }}
        >
          <img src={require("./assets/minus.png")} />
        </div>
        &nbsp;
        <div
          className="c-routePlanning-routes-action"
          onClick={() => (this.props.store.timeScale = 1)}
        >
          Reset
        </div>
      </div>
    );
  }
}
