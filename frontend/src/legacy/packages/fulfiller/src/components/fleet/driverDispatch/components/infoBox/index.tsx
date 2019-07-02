import React from "react";
import "./index.scss";
import { observer } from "mobx-react";
import { OverviewData } from "../../models/overviewData";

interface Props {
  data: OverviewData[];
}

@observer
export default class extends React.Component<Props> {
  constructor(props: Props) {
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
        {this.props.data.map(data => this.renderInfoBox(data.name, data.value))}
      </div>
    );
  }

  render() {
    return this.renderInfoBoxes();
  }
}
