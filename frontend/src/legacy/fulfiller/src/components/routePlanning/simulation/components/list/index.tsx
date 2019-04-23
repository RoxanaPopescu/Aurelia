import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import {
  TableComponent,
  ErrorInline,
  LoadingInline
} from "shared/src/webKit";
import { Row } from "shared/src/webKit/table";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { RouteSimulationService, RouteSimulationInfo } from "../../services/routeSimulationService/index";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

interface Props {
  history?: H.History;
}

@observer
export default class SimulationListComponent extends React.Component<Props> {

  private service = new RouteSimulationService();

  @observable
  private routeSimulations: RouteSimulationInfo[];

  @observable
  private error: Error;

  public async componentWillMount() {
    try {
      this.routeSimulations = await this.service.getSimulations();
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

    if (this.routeSimulations == null) {
      return <LoadingInline/>;
    }
    
    return (
      <>
        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Ruteplanlægning" }
          ]}
          tabs={[
            {
              title: "Ruteplaner",
              name: "route-plans",
              href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningList)
            },
            {
              title: "Indstillinger",
              name: "settings",
              href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningSettingList)
            },
            {
              title: "Ordregrupper",
              name: "order-groups",
              href: FulfillerSubPage.path(FulfillerSubPage.OrderGroupList)
            },
            {
              title: "Simulationer",
              name: "simulations",
              href: FulfillerSubPage.path(FulfillerSubPage.SimulationList)
            }
          ]}
          tab="simulations"
        />

        <PageContentComponent>

          <TableComponent
            data={{
              headers: [
                { key: "name", text: "Navn" },
                { key: "date", text: "Oprettet" }
              ],
              rows: this.getRows(this.routeSimulations)
            }}
            generateURL={index => FulfillerSubPage
              .path(FulfillerSubPage.SimulationResult)
              .replace(":id", this.routeSimulations[index].id)
            }
          />

        </PageContentComponent>
      </>
    );
  }

  private getRows(simulations: RouteSimulationInfo[]) {
    let rows: Row[][] = [];
    simulations.map(simulation => {
      rows.push([
        simulation.name,
        Localization.formatDateTime(simulation.created)
      ]);
    });

    return rows;
  }
}
