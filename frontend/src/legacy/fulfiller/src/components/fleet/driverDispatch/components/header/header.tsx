import React from "react";
import "./header.scss";
import { observer } from "mobx-react";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { driverDispatchService } from "../../driverDispatchService";

@observer
export default class extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  private renderInfoBox(headline: string, value: string | number): JSX.Element {
    return (
      <div key={headline} className="c-driverDispatch-infoBox">
        <h4 className="font-heading">{headline}</h4>
        <h4 className="font-largest">{value}</h4>
      </div>
    );
  }

  private renderInfoBoxes(): JSX.Element {
    return (
      <div className="c-driverDispatch-infoBoxes">
        {driverDispatchService.overviewData.map(data =>
          this.renderInfoBox(data.name, data.value)
        )}
      </div>
    );
  }

  render() {
    return (
      <PageHeaderComponent
        actionElements={<>{this.props.children}</>}
        path={[
          { title: "Chaufførdisponering" },
          { title: driverDispatchService.state.name }
        ]}
      >
        {this.renderInfoBoxes()}
      </PageHeaderComponent>
    );
  }
}
