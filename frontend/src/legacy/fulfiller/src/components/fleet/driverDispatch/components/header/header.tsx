import React from "react";
import "./header.scss";
import { observer } from "mobx-react";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { driverDispatchService } from "../../driverDispatchService";

@observer
export default class extends React.Component {
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

  private get path() {
    if (driverDispatchService.state === "forecasts") {
      return { title: "Forecasts" };
    } else if (driverDispatchService.state === "preBookings") {
      return { title: "Pre-bookings" };
    } else if (driverDispatchService.state === "unassignedRoutes") {
      return { title: "Unassigned routes" };
    } else {
      return { title: "Assigned routes" };
    }
  }

  render() {
    return (
      <PageHeaderComponent path={[{ title: "Chaufførdisponering" }, this.path]}>
        {this.renderInfoBoxes()}
      </PageHeaderComponent>
    );
  }
}
