import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { driverDispatchService } from "../../driverDispatchService";

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
          { title: "Disponering" },
          { title: driverDispatchService.state.name }
        ]}
      />
    );
  }
}
