import React from "react";
import "./styles.scss";
import { Button, ButtonType, InputNumbers } from "shared/src/webKit";
import H from "history";

interface Props {
  history?: H.History;
}

export default class RoutePlanningParametersComponent extends React.Component<
  Props
> {
  render() {
    return (
      <React.Fragment>
        <div className="c-routePlanning-parameters">
          <h4 className="cta1 c-routePlanning-parameters-title">
            Parameters for route
          </h4>
          <h4 className="list1 c-routePlanning-parameters-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at
            magna magna. Aenean sagittis sit amet magna tempor fermentum.
            Phasellus dapibus quam rutrum elit aliquam lacinia.
          </h4>
          <div className="c-routePlanning-parameters-grid">
            <div className="c-routePlanning-parameters-headline">
              Trafikmængde
            </div>
            <InputNumbers
              readonly={true}
              value={3}
              onChange={() => {
                /* */
              }}
            />
            <div className="c-routePlanning-parameters-headline">
              Max antal stop pr. rute
            </div>
            <InputNumbers
              readonly={true}
              value={100}
              onChange={() => {
                /* */
              }}
            />
            <div className="c-routePlanning-parameters-headline">
              Max antal timer pr. rute
            </div>
            <InputNumbers
              readonly={true}
              value={24}
              onChange={() => {
                /* */
              }}
            />
            <div className="c-routePlanning-parameters-headline">
              Optimeringsprioritering
            </div>
            <InputNumbers
              readonly={true}
              value={2}
              onChange={() => {
                /* */
              }}
            />
          </div>
          <div className="c-routePlanning-parameters-actions">
            <Button
              type={ButtonType.Neutral}
              onClick={() => this.props.history!.goBack()}
            >
              Tilbage
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
