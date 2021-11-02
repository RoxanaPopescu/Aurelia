import React from "react";
import { RoutePlanningStore } from "./store";
import { observer } from "mobx-react";
import RoutePlanningPlanComponent from "./plan";
import Localization from "shared/src/localization";
import {
  LoadingInline,
  ErrorInline,
  Button,
  ButtonType,
  Toast,
  ToastType
} from "shared/src/webKit";
import H from "history";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";

interface Props {
  history: H.History;
  // tslint:disable-next-line:no-any
  match: any;
}

@observer
export default class RoutePlanningDetailsComponent extends React.Component<
  Props
> {
  store = new RoutePlanningStore();

  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue(
      "RoutePlanning_RoutePlan_Details_Title"
    );
  }

  componentDidMount() {
    this.store.fetch(this.props.match.params.id)
      .then(() => addToRecentEntities(this.store.plan.toEntityInfo()));
  }

  render() {
    if (this.store.loading) {
      return (
        <LoadingInline/>
      );
    }

    if (this.store.initialError) {
      return (
        <ErrorInline description={this.store.initialError}>
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
      <React.Fragment>
        <RoutePlanningPlanComponent history={this.props.history} store={this.store} />

        {this.store.error && (
          <Toast
            type={ToastType.Warning}
            remove={() => (this.store.error = undefined)}
          >
            {this.store.error}
          </Toast>
        )}
        {this.store.toastMessage && (
          <Toast
            type={ToastType.Success}
            remove={() => (this.store.toastMessage = undefined)}
          >
            {this.store.toastMessage}
          </Toast>
        )}
      </React.Fragment>
    );
  }
}
