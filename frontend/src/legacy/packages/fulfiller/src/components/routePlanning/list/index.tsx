import React from "react";
import { observer } from "mobx-react";
import {
  TableComponent,
  ErrorInline,
  ButtonType,
  Button,
} from "shared/src/webKit";
import { RoutePlanListStore } from "./store";
import { FulfillerSubPage } from "../../navigation/page";
import Localization from "shared/src/localization";
import { ListRoutePlan } from "shared/src/model/logistics/routePlanning";
import H from "history";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

const store = new RoutePlanListStore();

interface Props {
  // tslint:disable-next-line:no-any
  match?: any;
  history?: H.History;
}

@observer
export default class RoutePlansComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue(
      "RoutePlanning_RoutePlan_List_Title"
    );
  }

  componentDidMount() {
    store.fetch();
  }

  getRows(plans: ListRoutePlan[]) {
    let rows: string[][] = [];
    plans.map(plan => {
      rows.push([
        Localization.formatDateTimeRange(plan.timeFrame),
        Localization.formatDateTime(plan.created),
        Localization.formatDateTime(plan.lastUpdated),
        plan.routeCount.toString(),
        plan.unscheduledStopsCount.toString(),
        plan.status
      ]);
    });

    return rows;
  }

  render() {

    if (store.error) {
      return (
        <ErrorInline description={store.error}>
          <Button onClick={() => store.fetch()} type={ButtonType.Action}>
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    if (!store.plans) {
      return undefined;
    }

    return (
      <React.Fragment>

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
          tab="route-plans"
        />

        <PageContentComponent>

          <TableComponent
            loading={store.loading}
            generateURL={index => {
              if (!store.plans) {
                return;
              }

              let plan = store.plans[index];
              if (
                plan.status !== "Completed" &&
                plan.status !== "WaitingForApproval"
              ) {
                return;
              }

              return FulfillerSubPage.path(
                FulfillerSubPage.RoutePlanningDetails
              ).replace(":id", store.plans[index].id.toString());
            }}
            canSelectRow={index => {
              if (!store.plans) {
                return false;
              }

              const plan = store.plans[index];
              if (
                plan.status === "Completed" ||
                plan.status === "WaitingForApproval"
              ) {
                return true;
              } else {
                return false;
              }
            }}
            data={{
              headers: store.headers,
              rows: this.getRows(store.plans)
            }}
          />

        </PageContentComponent>

      </React.Fragment>
    );
  }
}
