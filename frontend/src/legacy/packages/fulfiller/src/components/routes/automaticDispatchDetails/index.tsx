import React from "react";
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
import { RoutePlanningStore } from "./store";

interface Props {
  history: H.History;
  // tslint:disable-next-line:no-any
  match: any;
}

@observer
export default class RoutePlanningDetailsComponent extends React.Component<
  Props
> {
  private id: string;

  store: RoutePlanningStore;

  constructor(props: Props) {
    super(props);

    this.id = props.match.params.id;
    this.store = new RoutePlanningStore(props.match.params.automaticDispatchService);

    document.title = "Automatic dispatch job";
  }

  componentDidMount() {
    this.fetchResult();
  }

  async fetchResult() {
    this.store.fetch(this.id);
  }

  render() {
    if (this.store.loading) {
      return (
        <LoadingInline/>
      );
    }

    if (this.store.initialError) {
      return (
        <ErrorInline title={this.store.initialError}>
          <Button
            onClick={() => this.store.fetch(this.props.match.params.id)}
            type={ButtonType.Action}
          >
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    if (!["succeeded", "waiting-for-approval"].includes(this.store.job.status.slug)) {
      return (
        <ErrorInline title={`${Localization.sharedValue("AutomaticDispatch_JobNotReady")} (${this.store.job.status.slug})`} description={this.store.job.name}>
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
