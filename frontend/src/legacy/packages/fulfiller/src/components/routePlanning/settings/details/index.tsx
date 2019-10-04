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
  ToastType,
  ButtonSize
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
export default class RoutePlanningSettingsComponent extends React.Component<
  Props
> {
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
      this.store.fetchStrategies();
    }
  }

  render() {
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
              title: "Ruteplanlægning",
              href: FulfillerSubPage.path(
                FulfillerSubPage.RoutePlanningList
              )
            },
            { title: "Indstillinger",
              href: FulfillerSubPage.path(
                FulfillerSubPage.RoutePlanningSettingList
              )
            },
            { title: this.store.setting.name || "Ny indstilling" }
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
        >
          { this.tab !== "settings" &&
            <Button
            onClick={() => {
              this.store.hideOrShowAllCondition();
            }}
            key="hide-show-all"
            type={ButtonType.Action}
            size={ButtonSize.Medium}
          >
            { this.store.hiddenConditions.length > 0 ? "Vis alle områder" : "Skjul alle områder" }
          </Button>
        }
        </PageHeaderComponent>

        <PageContentComponent>
          <div className="c-routePlanning-settings-details-container">
            {this.tab === "settings" && <GeneralComponent store={this.store} />}

            {this.tab === "areas" && <ConditionsComponent store={this.store} />}
          </div>
        </PageContentComponent>

        {(this.store.mode === "assigningSettings" || this.store.editingSpecialCondition) && (
          <Dialog
            title="Tidspunkter og Begrænsninger"
            verifyCancel={this.store.editingSpecialCondition ? undefined : "Sikker på du vil annullere? Du skal oprette tegningen igen"}
            closeOnClickOutside={true}
            onClose={() => {
              this.store.clearDrawing();
              this.store.editingSpecialCondition = undefined;
            }}
          >
            <ConditionsPropertiesComponent
              store={this.store}
              updateCondition={this.store.editingSpecialCondition}
            />
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
