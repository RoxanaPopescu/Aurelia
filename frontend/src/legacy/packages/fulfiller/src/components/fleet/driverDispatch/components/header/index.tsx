import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { driverDispatchService } from "../../driverDispatchService";
import Localization from "shared/src/localization";

@observer
export default class extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <PageHeaderComponent
        actionElements={<>{this.props.children}</>}
        path={[
          { title: Localization.operationsValue("RoutePlanning_Title") },
          { title: Localization.operationsValue("Dispatch_Title") },
          { title: driverDispatchService.state.name }
        ]}
      />
    );
  }
}
