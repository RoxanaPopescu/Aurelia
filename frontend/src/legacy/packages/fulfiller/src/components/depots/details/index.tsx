import React from "react";
import { DepotStore } from "./store";
import { observer } from "mobx-react";
import DepotGeneralComponent from "./components/general";

import {
  LoadingInline,
  ErrorInline,
  Button,
  ButtonType
} from "shared/src/webKit";
import H from "history";
import Localization from "shared/src/localization";
import { Dialog } from "shared/src/components/dialog/dialog";
import { Depot } from "shared/src/model/logistics/depots";
import DepotActivityComponent from "./components/activity";
import DepotPortsComponent from "./components/ports";
import DepotPortsEditComponent from "./components/ports/components/edit/editPortForm";
import DepotScannedColliComponent from "./components/scannedColli";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { FulfillerSubPage } from "../../navigation/page";
import { PageContentComponent } from "shared/src/components/pageContent";
import { observable } from "mobx";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

@observer
export default class RoutePlanningDepotsDetailsComponent extends React.Component<
  Props
> {
  private store = new DepotStore();

  @observable
  private tab: string;

  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      this.store.depot = new Depot();
      this.store.loading = false;
      this.tab = "settings";
    } else {
      this.store.fetch(this.props.match.params.id);
      this.tab = "activity";
    }
  }

  render() {
    const title =
      this.store.depot != null
        ? this.store.depot.id != null
          ? this.store.depot.name
          : Localization.operationsValue("Depots_Create_Title")
        : Localization.operationsValue("Depots_Update_Loading");

    document.title = `${title} | ${Localization.operationsValue("Menu_Depots")}`;

    if (this.store.loading) {
      return <LoadingInline />;
    }

    if (this.store.error) {
      return (
        <ErrorInline description={this.store.error}>
          <Button
            onClick={() => this.store.fetch(this.props.match.params.id)}
            type={ButtonType.Action}
          >
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    return (
      <>
        <PageHeaderComponent
          history={this.props.history}
          path={[
            {
              title: Localization.operationsValue("Menu_Depots"),
              href: FulfillerSubPage.path(FulfillerSubPage.DepotList)
            },
            { title: title }
          ]}
          tabs={[
            ...(this.store.depot.id
              ? [
                  { name: "activity", title: Localization.operationsValue("Depots_Activity_Title") },
                  { name: "scanned", title: Localization.operationsValue("Depots_MissingColli_Title") }
                ]
              : []),

            { name: "settings", title: Localization.operationsValue("Depots_Settings_Title") },
            { name: "ports", title: Localization.operationsValue("Depots_Gates_Title") }
          ]}
          tab={this.tab}
          onTabChange={tab => {
            this.tab = tab;
          }}
        />

        <PageContentComponent>
          {this.tab === "activity" && (
            <DepotActivityComponent depotId={this.props.match.params.id} />
          )}

          {this.tab === "scanned" && (
            <DepotScannedColliComponent depotId={this.props.match.params.id} />
          )}

          {this.tab === "settings" && (
            <DepotGeneralComponent store={this.store} />
          )}

          {this.tab === "ports" && <DepotPortsComponent store={this.store} />}
        </PageContentComponent>

        {this.store.activeGate && (
          <Dialog
            title={
              this.store.activeGate.created ? Localization.operationsValue("Depots_Gates_Edit_Title") : Localization.operationsValue("Depots_Gates_Create_Title")
            }
            onClose={() => {
              this.store.activeGate = undefined;
            }}
          >
            <DepotPortsEditComponent store={this.store} />
          </Dialog>
        )}
      </>
    );
  }
}
