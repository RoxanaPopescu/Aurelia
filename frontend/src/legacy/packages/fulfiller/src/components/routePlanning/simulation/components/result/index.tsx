import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import {
  ErrorInline, LoadingInline, Button, ButtonType
} from "shared/src/webKit";
import H from "history";
import { ButtonSize } from "shared/src/webKit/button";
import Localization from "shared/src/localization";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { RouteSimulationResult, routeSimulationService } from "../../services/routeSimulationService";
import SimulationParametersComponent from "../parameters";

import "./index.scss";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history?: H.History;
}

@observer
export default class SimulationResultComponent extends React.Component<Props> {

  @observable
  private error: Error;

  @observable
  private routeSimulationResult: RouteSimulationResult;
  
  @observable
  private selectedIndex: number;

  public async componentWillMount() {
    try {
      const routeSimulationId = this.props.match.params.id;
      const routeSimulationResult = await routeSimulationService.getSimulationResult(routeSimulationId);
      this.selectedIndex = routeSimulationResult.summaries.length > 1 ? 1 : 0;
      this.routeSimulationResult = routeSimulationResult;
    } catch (error) {
      this.error = error;
    }
  }

  public render() {

    if (this.error) {
      return (
        <ErrorInline description={this.error.message}/>
      );
    }

    if (this.routeSimulationResult == null) {
      return <LoadingInline/>;
    }

    const selectedName =
      this.selectedIndex === 0 ?
        "original" :
          this.routeSimulationResult.summaries.length > 2 ?
            `simulation ${this.selectedIndex}` :
              "simulation";

    return (
      <>
        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Simulationer", href: FulfillerSubPage.path(FulfillerSubPage.SimulationList) },
            { title: "Resultat af simulation" }
          ]}
        />

        <PageContentComponent>

          <div className="c-routeSimulation-result-container">

            <div className="font-larger">Resultat af simulation</div>

            <div className="c-routeSimulation-result-comparison">

              <div className="c-routeSimulation-result-comparison-column">
                
                <div/>
                <div>Status</div>
                <div>Samlet tid</div>
                <div>Antal ruter</div>
                <div>Stop pr. time</div>
                <div>Kolli pr. rute</div>
                <div>Stop pr. rute</div>
                <div/>

              </div>

              {this.routeSimulationResult.summaries.map((s, i) =>
              <div
                key={s.routePlanId}
                className={
                  `c-routeSimulation-result-comparison-column
                  ${i === this.selectedIndex ? "selected" : ""}`}
                onClick={() => this.selectedIndex = i}
              >
                <div>
                    {i === 0 ?
                      "Original" :
                        this.routeSimulationResult.summaries.length > 2 ?
                          `Simulation ${i}` :
                            "Simulation"}
                </div>

                <div>{s.metrics ? "Færdig" : "Igang..."}</div>
                <div>{s.metrics ? Localization.formatDuration(s.metrics.totalTime) : ""}</div>
                <div>{s.metrics ? Localization.formatNumber(s.metrics.routeCount) : ""}</div>
                <div>{s.metrics ? Localization.formatNumber(s.metrics.stopPerHour) : ""}</div>
                <div>{s.metrics ? Localization.formatNumber(s.metrics.colliPerRoute) : ""}</div>
                <div>{s.metrics ? Localization.formatNumber(s.metrics.stopPerRoute) : ""}</div>

                <div>
                  <div className="c-routeSimulation-result-comparison-column-bottom1">
                    <Button
                      type={ButtonType.Action}
                      size={ButtonSize.Small}
                      onClick={() => window.open(
                        FulfillerSubPage
                        .path(FulfillerSubPage.RoutePlanningDetails)
                        .replace(":id", s.routePlanId))}
                    >
                      Se ruteplan
                    </Button>
                  </div>
                  <div className="c-routeSimulation-result-comparison-column-bottom2">
                    Se indstillinger
                  </div>
                </div>

              </div>)}

            </div>

            <div className="font-large">>Indstillinger for {selectedName}</div>

            <SimulationParametersComponent
              parameters={this.routeSimulationResult.summaries[this.selectedIndex].parameters}
              readonly={true}
            />

          </div>

        </PageContentComponent>

      </>
    );
  }
}
