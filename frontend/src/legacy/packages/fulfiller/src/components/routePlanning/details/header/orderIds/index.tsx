import React from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { RoutePlanRouteStop } from "shared/src/model/logistics/routePlanning";

interface Props {
  stop: RoutePlanRouteStop;
}

export default class RoutePlanningOrderIdsComponent extends React.Component<
  Props
> {
  render() {
    return (
      <div className="c-routePlanning-orderIds-container">
        {this.props.stop.orderIds.map(orderId => (
          <Link to={`/orders/details/${orderId}`} target="_blank">
            {orderId}
          </Link>
        ))}
      </div>
    );
  }
}
