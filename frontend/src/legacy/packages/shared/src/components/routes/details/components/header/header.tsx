import React from "react";
import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import { SubPage } from "shared/src/utillity/page";
import { Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { Session } from "shared/src/model/session";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { RouteDetailsService } from "../../routeDetailsService";
import AssignDriverButton from "./components/assignDriver/assignDriver";
import AssignFulfillerButton from "./components/assignFulfiller/assignFulfiller";
import "./header.scss";
import { PageHeaderComponent } from "shared/src/components/pageHeader";

interface Props {
  service: RouteDetailsService;
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
          { title: "Ruter", href: SubPage.path(SubPage.RouteList) },
          { title: this.props.service.routeDetails!.slug }
        ]}
      >

        {isFulfiller && this.props.service.routeDetails!.driverListUrl &&
        <Button
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          onClick={() => window.open(this.props.service.routeDetails!.driverListUrl)}
        >
          {Localization.sharedValue("RouteDetails_PrintDriverList")}
        </Button>}

        {isFulfiller &&
        <AssignFulfillerButton route={this.props.service.routeDetails!}/>}

        {isFulfiller &&
        <AssignDriverButton route={this.props.service.routeDetails!}/>}

      </PageHeaderComponent>
    );
  }
}