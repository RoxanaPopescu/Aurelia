import React from "react";
import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import { Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { Session } from "shared/src/model/session";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { RouteDetailsService } from "../../routeDetailsService";
import { RouteDispatchService } from "../../routeDispatchService";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import AssignDriverButton from "./components/assignDriver/assignDriver";
import AssignFulfillerButton from "./components/assignFulfiller/assignFulfiller";
import SetStatusButton from "./components/setStatus/setStatus";
import ReloadRouteButton from "./components/reloadRoute/reloadRoute";
import "./header.scss";
import { Profile } from "shared/src/model/profile";

interface Props {
  detailsService: RouteDetailsService;
  dispatchService: RouteDispatchService;
  history?: H.History;
}

@observer
export default class extends React.Component<Props> {
  public render() {
    const isFulfiller = Session.outfit instanceof Fulfiller;
    return (
      <PageHeaderComponent
        history={this.props.history}
        path={[
          { title: this.props.detailsService.routeDetails!.slug }
        ]}
      >

        {isFulfiller && this.props.detailsService.routeDetails!.driverListUrl &&
        <Button
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => window.open(this.props.detailsService.routeDetails!.driverListUrl)}
        >
          {Localization.sharedValue("RouteDetails_PrintDriverList")}
        </Button>}

        {Profile.claims.has("edit-routes") &&
        <>
          {isFulfiller &&
          <AssignFulfillerButton route={this.props.detailsService.routeDetails!}/>}

          {isFulfiller &&
          <AssignDriverButton route={this.props.detailsService.routeDetails!}/>}

          {isFulfiller &&
          <SetStatusButton route={this.props.detailsService.routeDetails!}/>}

          {isFulfiller && ["started"].includes(this.props.detailsService.routeDetails!.status.slug) &&
          <ReloadRouteButton route={this.props.detailsService.routeDetails!}/>}
        </>}

      </PageHeaderComponent>
    );
  }
}
