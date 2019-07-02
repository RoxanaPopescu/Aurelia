import React from "react";
import "./stop.scss";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteStop } from "shared/src/model/logistics/routes/details";
import Localization from "../../../../../../../localization";
import { Link } from "react-router-dom";
import { Collo } from "shared/src/model/logistics/collo";

// The number of non-problematic colli to show in a collapsed colli list.
const maxAdditionalColliCountWhenCollapsed = 2;

let expandedStop: { expanded: boolean };

interface Props {
  routeStop: RouteStop;
  nextRouteStop?: RouteStop;
}

@observer
export default class extends React.Component<Props> {
  @observable public expanded = false;

  @observable public expandPickups = false;

  @observable public expandDeliveries = false;

  public toggle(): void {
    if (expandedStop != null && expandedStop !== this) {
      expandedStop.expanded = false;
    }
    this.expanded = !this.expanded;
    expandedStop = this;
  }

  public render() {
    let showExpandPickupsButton = false;
    let totalPickupColliCount = 0;
    let additionalPickupColliCount = 0;
    const pickupColli: Collo[] = [];

    for (const pickup of this.props.routeStop.pickups) {
      totalPickupColliCount += pickup.colli.length;

      pickupColli.push(
        ...pickup.colli.filter(c => c.status.accent.pickup === "negative")
      );
    }

    for (const pickup of this.props.routeStop.pickups) {
      let additionalColli = [
        ...pickup.colli.filter(c => c.status.accent.pickup === "neutral"),
        ...pickup.colli.filter(c => c.status.accent.pickup === "positive")
      ];

      additionalPickupColliCount += additionalColli.length;

      showExpandPickupsButton =
        additionalPickupColliCount > maxAdditionalColliCountWhenCollapsed;

      if (!this.expandPickups) {
        additionalColli = additionalColli.slice(
          0,
          maxAdditionalColliCountWhenCollapsed - additionalPickupColliCount
        );
      }

      pickupColli.push(...additionalColli);
    }

    let showExpandDeliveriesButton = false;
    let totalDeliveryColliCount = 0;
    let additionalDeliveryColliCount = 0;
    const deliveryColli: Collo[] = [];

    for (const delivery of this.props.routeStop.deliveries) {
      totalDeliveryColliCount += delivery.colli.length;

      deliveryColli.push(
        ...delivery.colli.filter(c => c.status.accent.delivery === "negative")
      );
    }

    for (const delivery of this.props.routeStop.deliveries) {
      let additionalColli = [
        ...delivery.colli.filter(c => c.status.accent.delivery === "neutral"),
        ...delivery.colli.filter(c => c.status.accent.delivery === "positive")
      ];

      additionalDeliveryColliCount += additionalColli.length;

      showExpandDeliveriesButton =
        deliveryColli.length + additionalColli.length >
        maxAdditionalColliCountWhenCollapsed;

      if (!this.expandDeliveries) {
        additionalColli = additionalColli.slice(
          0,
          maxAdditionalColliCountWhenCollapsed - additionalDeliveryColliCount
        );
      }

      deliveryColli.push(...additionalColli);
    }

    return (
      <div
        className={`
          c-routeDetails-stops-stop
          ${this.props.routeStop.status.slug}
          ${
            this.props.nextRouteStop
              ? "next-" + this.props.nextRouteStop.status.slug
              : ""
          }`}
      >
        <div className="c-routeDetails-stops-stop-marker">
          <div className="c-routeDetails-stops-stop-marker-circle" />
          {this.props.routeStop.hasAlert && (
            <div className="c-routeDetails-stops-stop-marker-alert" />
          )}
          {!this.props.routeStop.hasAlert &&
            this.props.routeStop.hasWarning && (
              <div className="c-routeDetails-stops-stop-marker-warning" />
            )}
        </div>

        <div className="c-routeDetails-stops-stop-container">
          <div
            className={
              "c-routeDetails-stops-stop-header user-select-text suppress-double-click" +
              (this.expanded ? " expanded" : "")
            }
            onClick={() => this.toggle()}
          >
            <div>{this.props.routeStop.stopNumber}</div>
            <div>{this.props.routeStop.location.address.toString()}</div>
            <div>
              {Localization.formatDate(
                this.props.routeStop.arrivalTime ||
                  this.props.routeStop.arrivalTimeFrame.from ||
                  this.props.routeStop.arrivalTimeFrame.to
              )}
            </div>
            <div
              className={
                this.props.routeStop.isDelayed
                  ? "c-routeDetails-color-negative"
                  : ""
              }
            >
              {Localization.formatTime(this.props.routeStop.arrivalTime)}
            </div>
            <div>
              {Localization.formatTimeRange(
                this.props.routeStop.arrivalTimeFrame
              )}
            </div>
            <div>
              {Localization.formatDuration(this.props.routeStop.loadingTime)}
            </div>
          </div>

          {this.expanded && (
            <div className="c-routeDetails-stops-stop-details user-select-text">
              <div className="c-routeDetails-stops-stop-details-row">
                <div className="c-routeDetails-stops-stop-details-heading font-heading">
                  {Localization.sharedValue("RouteDetails_Stops_Stop_Status")}
                </div>
                <div
                  className={`c-routeDetails-color-${
                    this.props.routeStop.status.accent
                  }`}
                >
                  {this.props.routeStop.status.name}
                </div>
              </div>

              {this.props.routeStop.outfit && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue(
                      "RouteDetails_Stops_Stop_CustomerInformation"
                    )}
                  </div>
                  {this.props.routeStop.outfit.primaryName && (
                    <div className="c-routeDetails-stops-stop-details-dataRow">
                      <div>
                        {Localization.sharedValue(
                          "RouteDetails_Stops_Stop_Name"
                        )}
                      </div>
                      <div>{this.props.routeStop.outfit.primaryName}</div>
                    </div>
                  )}
                  {this.props.routeStop.outfit.secondaryName && (
                    <div className="c-routeDetails-stops-stop-details-dataRow">
                      <div>
                        {Localization.sharedValue(
                          "RouteDetails_Stops_Stop_Contact"
                        )}
                      </div>
                      <div>{this.props.routeStop.outfit.secondaryName}</div>
                    </div>
                  )}
                  {this.props.routeStop.outfit.contactPhone && (
                    <div className="c-routeDetails-stops-stop-details-dataRow">
                      <div>
                        {Localization.sharedValue(
                          "RouteDetails_Stops_Stop_Phone"
                        )}
                      </div>
                      <div>
                        {this.props.routeStop.outfit.contactPhone.toString()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {this.props.routeStop.gate && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue("RouteDetails_Stops_Stop_Port")}
                  </div>
                  <div>{this.props.routeStop.gate}</div>
                </div>
              )}

              {this.props.routeStop.driverInstructions && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue(
                      "RouteDetails_Stops_Stop_DriverInstructions"
                    )}
                  </div>
                  <div>{this.props.routeStop.driverInstructions}</div>
                </div>
              )}

              {pickupColli.length > 0 && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue(
                      "RouteDetails_Stops_Stop_Pickups",
                      { colliCount: totalPickupColliCount }
                    )}
                  </div>
                  {pickupColli.map(p => (
                    <div
                      className="c-routeDetails-stops-stop-details-collo"
                      key={p.barcode}
                    >
                      <Link
                        to={`/orders/details/${p.orderSlug}?collo=${p.barcode}`}
                        target="_blank"
                      >
                        {p.barcode}
                      </Link>
                      <Link
                        to={`/orders/details/${p.orderSlug}`}
                        target="_blank"
                      >
                        {p.orderSlug}
                      </Link>
                      {p.origin.slug !== "regular" && (
                        <div className="c-routeDetails-stops-stop-details-collo-origin">
                          {p.origin.name}
                        </div>
                      )}
                      <div
                        className={`c-routeDetails-color-${
                          p.status.accent.pickup
                        }`}
                      >
                        {p.status.name}
                      </div>
                    </div>
                  ))}
                  {showExpandPickupsButton && (
                    <a
                      className="c-routeDetails-stops-stop-details-linkButton"
                      onClick={() => (this.expandPickups = !this.expandPickups)}
                    >
                      {this.expandPickups
                        ? Localization.sharedValue(
                            "RouteDetails_Stops_Stop_Accordion_ShowLess"
                          )
                        : Localization.sharedValue(
                            "RouteDetails_Stops_Stop_Accordion_ShowMore"
                          )}
                    </a>
                  )}
                </div>
              )}

              {deliveryColli.length > 0 && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue(
                      "RouteDetails_Stops_Stop_Deliveries",
                      { colliCount: totalDeliveryColliCount }
                    )}
                  </div>
                  {deliveryColli.map(d => (
                    <div
                      className="c-routeDetails-stops-stop-details-collo"
                      key={d.barcode}
                    >
                      <Link
                        to={`/orders/details/${d.orderSlug}?collo=${d.barcode}`}
                        target="_blank"
                      >
                        {d.barcode}
                      </Link>
                      <Link
                        to={`/orders/details/${d.orderSlug}`}
                        target="_blank"
                      >
                        {d.orderSlug}
                      </Link>
                      <div
                        className={`c-routeDetails-color-${
                          d.status.accent.delivery
                        }`}
                      >
                        {d.status.name}
                      </div>
                      {d.origin.slug !== "regular" && (
                        <div className="c-routeDetails-stops-stop-details-collo-origin">
                          {d.origin.name}
                        </div>
                      )}
                    </div>
                  ))}
                  {showExpandDeliveriesButton && (
                    <a
                      className="c-routeDetails-stops-stop-details-linkButton"
                      onClick={() =>
                        (this.expandDeliveries = !this.expandDeliveries)
                      }
                    >
                      {this.expandDeliveries
                        ? Localization.sharedValue(
                            "RouteDetails_Stops_Stop_Accordion_ShowLess"
                          )
                        : Localization.sharedValue(
                            "RouteDetails_Stops_Stop_Accordion_ShowMore"
                          )}
                    </a>
                  )}
                </div>
              )}

              {(this.props.routeStop.photoRequired ||
                this.props.routeStop.photo) && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue("RouteDetails_Stops_Stop_Photo")}
                  </div>
                  {this.props.routeStop.photoRequired && (
                    <p>
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_PhotoRequired"
                      )}
                    </p>
                  )}
                  {this.props.routeStop.photo && (
                    <a
                      className="c-routeDetails-stops-stop-details-linkButton"
                      href={this.props.routeStop.photo.imageUrl}
                      target="_blank"
                    >
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_SeePhoto"
                      )}
                    </a>
                  )}
                </div>
              )}

              {(this.props.routeStop.signatureRequired ||
                this.props.routeStop.signature) && (
                <div className="c-routeDetails-stops-stop-details-row">
                  <div className="c-routeDetails-stops-stop-details-heading font-heading">
                    {Localization.sharedValue(
                      "RouteDetails_Stops_Stop_Signature"
                    )}
                  </div>
                  {this.props.routeStop.signatureRequired && (
                    <p>
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_SignatureRequired"
                      )}
                    </p>
                  )}
                  {this.props.routeStop.signature && (
                    <a
                      className="c-routeDetails-stops-stop-details-linkButton"
                      href={this.props.routeStop.signature.imageUrl}
                      target="_blank"
                    >
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_SeeSignature"
                      )}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
