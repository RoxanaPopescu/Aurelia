import React from "react";
import "./metrics.scss";
import Localization from "shared/src/localization";
import Metric from "./components/metric/metric";
import { RouteDetailsService } from "../../routeDetailsService";
import { observer } from "mobx-react";
import { RouteStop } from "shared/src/model/logistics/routes/details";

@observer
export default class extends React.Component<{ service: RouteDetailsService }> {
  public render() {
    const visibleStops = this.props.service.routeDetails!.stops
      .filter(s => s instanceof RouteStop) as RouteStop[];

    let colliTotal = 0;
    let colliPickedUp = 0;
    let colliDelivered = 0;
    let colliMissingAtPickup = 0;
    let colliMissingAtDelivery = 0;

    for (const stop of visibleStops) {
      for (const pickup of stop.pickups) {
        const notPickedUp = pickup.colli.filter(
          c => c.status.slug === "not-picked-up"
        ).length;
        colliTotal += pickup.colli.length;
        if (stop.status.slug === "completed") {
          colliPickedUp += pickup.colli.length - notPickedUp;
          colliMissingAtPickup += notPickedUp;
        }
      }

      for (const delivery of stop.deliveries) {
        const notPickedUp = delivery.colli.filter(
          c => c.status.slug === "not-picked-up"
        ).length;
        const notDelivered = delivery.colli.filter(
          c => c.status.slug === "not-delivered"
        ).length;
        if (stop.status.slug === "completed") {
          colliDelivered += delivery.colli.length - notPickedUp;
          colliMissingAtDelivery += notDelivered;
        }
      }
    }

    let colliNotDelivered =
      this.props.service.routeDetails!.status.slug === "completed" ||
      this.props.service.routeDetails!.status.slug === "cancelled"
        ? colliPickedUp - colliDelivered
        : 0;

    return (
      <div className="c-routeDetails-metrics user-select-text">
        {/* {this.props.route.overallRating &&
        <Metric
          header=""
          body={`${this.props.route.overallRating}/5`}
          footer={Localization.sharedValue("RouteDetails_Metrics_Rating_Rating")}
          accent={
            this.props.route.overallRating >= 4 ? "positive" :
            "negative"}
        />} */}

        <Metric
          header={
            colliPickedUp === colliTotal
              ? Localization.sharedValue(
                  "RouteDetails_Metrics_Pickups_AllColliPickedUp"
                )
              : colliMissingAtPickup > 0
                ? Localization.sharedValue(
                    "RouteDetails_Metrics_Pickups_ColliMissing",
                    { count: colliMissingAtPickup }
                  )
                : ""
          }
          body={`${colliPickedUp}`}
          footer={Localization.sharedValue(
            "RouteDetails_Metrics_Pickups_ColliPickedUp"
          )}
          accent={
            colliPickedUp === colliTotal
              ? "positive"
              : colliMissingAtPickup > 0
                ? "negative"
                : "neutral"
          }
        />

        <Metric
          header={
            colliDelivered === colliTotal
              ? Localization.sharedValue(
                  "RouteDetails_Metrics_Deliveries_AllColliDelivered"
                )
              : colliMissingAtDelivery > 0
                ? Localization.sharedValue(
                    "RouteDetails_Metrics_Deliveries_ColliMissing",
                    { count: colliMissingAtDelivery }
                  )
                : colliNotDelivered > 0
                  ? Localization.sharedValue(
                      "RouteDetails_Metrics_Deliveries_ColliRemaining",
                      { count: colliNotDelivered }
                    )
                  : ""
          }
          body={`${colliDelivered}`}
          footer={Localization.sharedValue(
            "RouteDetails_Metrics_Deliveries_ColliDelivered"
          )}
          accent={
            colliDelivered === colliTotal
              ? "positive"
              : colliMissingAtDelivery > 0 || colliNotDelivered > 0
                ? "negative"
                : "neutral"
          }
        />

        <Metric
          header={
            this.props.service.routeDetails!.cancelledStopCount > 0
              ? Localization.sharedValue(
                  "RouteDetails_Metrics_StopsOnRoute_StopsCancelled",
                  { count: this.props.service.routeDetails!.cancelledStopCount }
                )
              : ""
          }
          body={`${this.props.service.routeDetails!.totalStopCount}`}
          footer={Localization.sharedValue(
            "RouteDetails_Metrics_StopsOnRoute_StopsOnRoute"
          )}
          accent="neutral"
        />

        <Metric
          header=""
          body={`${this.props.service.routeDetails!.visitedStopCount}`}
          footer={Localization.sharedValue(
            "RouteDetails_Metrics_StopsVisited_StopsVisited"
          )}
        />

        {this.props.service.routeDetails!.completionTime && (
          <Metric
            header=""
            body={Localization.formatTime(
              this.props.service.routeDetails!.completionTime
            )}
            footer={Localization.sharedValue(
              "RouteDetails_Metrics_RouteTime_EstimatedTimeOfCompletion"
            )}
          />
        )}
      </div>
    );
  }
}
