import React from "react";
import { RoutePlanningStore } from "./store";
import { observer } from "mobx-react";
import RoutePlanningPlanComponent from "./plan";
import Localization from "shared/src/localization";
import {
  LoadingInline,
  ErrorInline,
  Button,
  ButtonType
} from "shared/src/webKit";
import H from "history";

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
    this.store.fetch(this.props.match.params.id);
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

    return <RoutePlanningPlanComponent history={this.props.history} store={this.store} />;
  }
}
