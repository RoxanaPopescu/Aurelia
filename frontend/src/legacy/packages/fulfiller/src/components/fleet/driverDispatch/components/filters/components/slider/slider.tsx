import React from "react";
import "./slider.scss";

interface Props {
  headline: string;
  collapsible?: boolean;
}

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
