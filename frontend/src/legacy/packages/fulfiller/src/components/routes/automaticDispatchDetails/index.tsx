import React from "react";
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
import { AutomaticDispatchService } from "app/model/automatic-dispatch";
import { observable } from "mobx";

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
  private service: AutomaticDispatchService;
  @observable
  private loading = true;
  private error: string | undefined;

  constructor(props: Props) {
    super(props);

    this.id = props.match.params.id;
    this.service = props.match.params.automaticDispatchService;

    console.log("YOLO!!!", props.match.params);

    document.title = Localization.operationsValue(
      "RoutePlanning_RoutePlan_Details_Title"
    );
  }

  componentDidMount() {
    this.fetchResult();
  }

  async fetchResult() {
    try {
      await this.service.get(this.id);
    } catch {
      this.error = Localization.sharedValue(
        "Error_General"
      );
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return (
        <LoadingInline/>
      );
    }

    if (this.error != null) {
      return (
        <ErrorInline description={this.error}>
          <Button
            onClick={() => this.fetchResult()}
            type={ButtonType.Action}
          >
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    let store: any = "";

    return (
      <React.Fragment>
        <RoutePlanningPlanComponent history={this.props.history} store={store} />
      </React.Fragment>
    );
  }
}
