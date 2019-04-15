import React from "react";
import "./slider.scss";
import { observer } from "mobx-react";

interface Props {
  headline: string;
  collapsible?: boolean;
}

@observer
export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div className="c-driverDispatch-filters-slider">
        <h4 className="font-heading-large c-driverDispatch-filters-slider-header">
          {this.props.headline}
        </h4>
        <div className="c-driverDispatch-filters-slider-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}
