import React from "react";
import "./styles.scss";
import { RoutePlanningSettingsStore } from "./store";
import { observer } from "mobx-react";
import H from "history";
import GeneralComponent from "./components/general";
import ConditionsComponent from "./components/conditions";
import ConditionsPropertiesComponent from "./components/conditions/properties";
import { Dialog } from "shared/src/components/dialog/dialog";
import {
  LoadingInline,
  ErrorInline,
  Button,
  ButtonType,
  Toast,
  ToastType
} from "shared/src/webKit";
import Localization from "shared/src/localization";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import { observable } from "mobx";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history: H.History;
}

@observer
export default class RoutePlanningSettingsComponent extends React.Component<Props> {
  private store = new RoutePlanningSettingsStore();

  @observable
  private tab = "settings";

  // tslint:disable-next-line:no-any
  constructor(props: Props) {
    super(props);
    document.title = "Route indstillinger";
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      this.store.loading = false;
    } else {
      this.store.fetch(this.props.match.params.id);
    }
  }

  render() {
    if (this.store.loading) {
      return (
        <LoadingInline/>
      );
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
            { title: "Ruteplanlægning", href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningSettingList) },
            { title: "Indstillinger" }
          ]}
          tabs={[
            {
              title: "Generelle indstillinger",
              name: "settings"
            },
            {
              title: "Specielle områder og tidspunkter",
              name: "areas",
              disabled: this.store.setting.id === undefined
            }
          ]}
          tab={this.tab}
          onTabChange={tab => {
            this.tab = tab;
          }}
        />

        <div className="c-routePlanning-settings-details-container">
          <PageContentComponent>

            {this.tab === "settings" &&
            <GeneralComponent store={this.store} />}

            {this.tab === "areas" &&
            <ConditionsComponent store={this.store} />}

          </PageContentComponent>
        </div>

        {this.store.mode === "assigningSettings" && (
          <Dialog
            title="Tidspunkter og Begrænsninger"
            verifyCancel="Sikker på du vil annullere? Du skal oprette tegningen igen"
            closeOnClickOutside={true}
            onClose={() => {
              this.store.clearDrawing();
            }}
          >
            <ConditionsPropertiesComponent store={this.store} />
          </Dialog>
        )}

        {this.store.toastMessage && (
          <Toast
            type={ToastType.Success}
            remove={() => (this.store.toastMessage = undefined)}
          >
            {this.store.toastMessage}
          </Toast>
        )}

      </>
    );
  }
}
