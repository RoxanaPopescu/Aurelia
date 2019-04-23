import React from "react";
import { observer } from "mobx-react";
import H from "history";
import {
  TableComponent,
  ErrorInline,
  ButtonType,
  Button,
  ButtonSize,
  ButtonAdd
} from "shared/src/webKit";
import { RoutePlanSettingListStore } from "./store";
import Localization from "shared/src/localization";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { RoutePlanSetting } from "shared/src/model/logistics/routePlanning/settings";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

const store = new RoutePlanSettingListStore();

interface Props {
  history?: H.History;
}

@observer
export default class RoutePlansComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue(
      "RoutePlanning_Settings_List_Title"
    );
  }

  componentDidMount() {
    store.fetch();
  }

  getRows(settings: RoutePlanSetting[]) {
    let rows: string[][] = [];
    settings.map(setting => {
      rows.push([
        setting.name,
        String(setting.parameters.specialConditions.length)
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

    if (!store.settings) {
      return undefined;
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
          tab="settings"
        >

          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => this.props.history!.push(FulfillerSubPage.path(FulfillerSubPage.RoutePlanningSettingCreate))}
          >
            Tilføj indstilling
          </ButtonAdd>

        </PageHeaderComponent>

        <PageContentComponent>

          <TableComponent
            loading={store.loading}
            generateURL={index => {
              if (!store.settings) {
                return;
              }

              return FulfillerSubPage.path(
                FulfillerSubPage.RoutePlanningSettingDetails
              ).replace(":id", store.settings[index].id.toString());
            }}
            data={{
              headers: store.headers,
              rows: this.getRows(store.settings)
            }}
          />
        </PageContentComponent>
      </>
    );
  }
}
