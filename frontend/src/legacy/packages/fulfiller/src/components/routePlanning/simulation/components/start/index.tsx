import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import H from "history";
import {
  Input, DividerComponent, Button, ButtonType, ErrorInline, LoadingInline
} from "shared/src/webKit";
import { ButtonSize } from "shared/src/webKit/button";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { RouteSimulationStart, routeSimulationService } from "../../services/routeSimulationService";
import SimulationParametersComponent from "../parameters";
import "./index.scss";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

interface Props {
  history: H.History;
  // tslint:disable-next-line:no-any
  match: any;
}

@observer
export default class SimulationStartComponent extends React.Component<Props> {

  @observable
  private error: Error;

  @observable
  private routeSimulation: RouteSimulationStart;

  @observable
  private busy = false;

  public async componentWillMount() {
    try {
      const routePlanId = this.props.match.params.id;
      this.routeSimulation = await routeSimulationService.createSimulation(routePlanId);
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

    if (this.routeSimulation == null || this.busy) {
      return <LoadingInline/>;
    }

    return (
      <>
        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Ruteplanlægning", href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningList) },
            { title: "Simulationer", href: FulfillerSubPage.path(FulfillerSubPage.SimulationList) },
            { title: "Ny simulation" }
          ]}
        >

          <Button
            disabled={!this.routeSimulation.name}
            size={ButtonSize.Medium}
            onClick={async () => {
              try {
                this.busy = true;
                await routeSimulationService.startSimulation(this.routeSimulation);
                this.props.history.push(FulfillerSubPage.path(FulfillerSubPage.SimulationList));
              } catch (error) {
                this.error = error;
              }
              this.busy = false;
            }}
            type={ButtonType.Action}
          >
            Start simulation
          </Button>

        </PageHeaderComponent>

        <PageContentComponent>

          <div className="c-routeSimulation-start-container">

            <div className="font-large">Simulation</div>

            <Input
              size={"medium"}
              headline="NAVN"
              placeholder="Indtast navn"
              onChange={value => {
                this.routeSimulation.name = value;
              }}
              value={this.routeSimulation.name}
              error={false}
            />

            <DividerComponent />

            <SimulationParametersComponent parameters={this.routeSimulation.parameters} readonly={false}/>

          </div>

        </PageContentComponent>

      </>
    );
  }
}
