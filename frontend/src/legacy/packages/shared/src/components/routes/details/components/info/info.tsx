import React from "react";
import "./info.scss";
import { Route, RouteStop } from "shared/src/model/logistics/routes/details";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import { RouteDetailsService } from "../../routeDetailsService";

@observer
export default class extends React.Component<{ service: RouteDetailsService }> {
  public render() {
    return (
      <div className="c-routeDetails-info">
        {this.renderRouteOverview(this.props.service.routeDetails!)}

        {this.props.service.routeDetails!.plannedTimeFrame &&
          this.renderPlannedTime(this.props.service.routeDetails!)}

        {this.props.service.routeDetails!.stops[0] instanceof RouteStop &&
          this.renderPickupInformation(this.props.service.routeDetails!
            .stops[0] as RouteStop)}

        {(this.props.service.routeDetails!.driver &&
          this.renderDriverInformation(this.props.service.routeDetails!)) ||
          (this.props.service.routeDetails!.fulfiller &&
            this.renderFulfillerInformation(this.props.service.routeDetails!))}

        {this.props.service.routeDetails!.driverVehicle &&
          this.renderVehicleInformation(this.props.service.routeDetails!)}

        {this.props.service.routeDetails!.priceOverview &&
          this.renderPriceOverview(this.props.service.routeDetails!)}
      </div>
    );
  }

  private renderRouteOverview(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_RouteOverview_Heading")}
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>{Localization.sharedValue("RouteDetails_RouteOverview_Id")}</div>
          <div>{route.slug}</div>
        </div>

        {route.reference && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_RouteOverview_Reference")}
            </div>
            <div>{route.reference}</div>
          </div>
        )}

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_RouteOverview_State")}
          </div>
          <div className={`c-routeDetails-color-${route.status.accent}`}>
            {route.status.name}
          </div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_RouteOverview_VehicleType")}
          </div>
          <div>{route.vehicleType.name}</div>
        </div>
      </div>
    );
  }

  private renderPlannedTime(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_Timeframe_Heading")}
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {(route.status.slug !== "completed" &&
              route.status.slug !== "cancelled" &&
              Localization.sharedValue("RouteDetails_Timeframe_Starting")) ||
              Localization.sharedValue("RouteDetails_Timeframe_Started")}
          </div>
          <div>{Localization.formatDateTime(route.plannedTimeFrame!.from)}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {(route.status.slug !== "completed" &&
              route.status.slug !== "cancelled" &&
              Localization.sharedValue("RouteDetails_Timeframe_Ending")) ||
              Localization.sharedValue("RouteDetails_Timeframe_Ended")}
          </div>
          <div>{Localization.formatDateTime(route.plannedTimeFrame!.to)}</div>
        </div>
      </div>
    );
  }

  private renderPickupInformation(firstRouteStop: RouteStop) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_PickupInformation_Heading")}
        </div>

        {firstRouteStop.outfit &&
          firstRouteStop.outfit!.companyName && (
            <div className="c-routeDetails-info-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_PickupInformation_Name"
                )}
              </div>
              <div>{firstRouteStop.outfit!.companyName}</div>
            </div>
          )}

        {firstRouteStop.outfit &&
          firstRouteStop.outfit!.contactPerson && (
            <div className="c-routeDetails-info-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_PickupInformation_Contact"
                )}
              </div>
              <div>{firstRouteStop.outfit!.contactPerson}</div>
            </div>
          )}

        {firstRouteStop.location.address && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_PickupInformation_Address"
              )}
            </div>
            <div>
              {firstRouteStop.location.address.primary}
              {firstRouteStop.location.address.secondary && (
                <React.Fragment>
                  <br />
                  {firstRouteStop.location.address.secondary}
                </React.Fragment>
              )}
            </div>
          </div>
        )}

        {firstRouteStop.gate && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue("RouteDetails_PickupInformation_Gate")}
            </div>
            <div>{firstRouteStop.gate}</div>
          </div>
        )}

        {firstRouteStop.outfit &&
          firstRouteStop.outfit!.contactPhone && (
            <div className="c-routeDetails-info-section-row">
              <div>
                {Localization.sharedValue(
                  "RouteDetails_PickupInformation_PhoneNumber"
                )}
              </div>
              <div>{firstRouteStop.outfit!.contactPhone!.toString()}</div>
            </div>
          )}
      </div>
    );
  }

  private renderFulfillerInformation(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue(
            "RouteDetails_PickupInformation_FulfillerInformation_Heading"
          )}
        </div>

        {route.fulfiller.companyName && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_PickupInformation_FulfillerInformation_Name"
              )}
            </div>
            <div>{route.fulfiller.companyName}</div>
          </div>
        )}

        {route.fulfiller.contactPerson && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_PickupInformation_FulfillerInformation_Contact"
              )}
            </div>
            <div>{route.fulfiller.contactPerson}</div>
          </div>
        )}

        {route.fulfiller.contactPhone && (
          <div className="c-routeDetails-info-section-row">
            <div>
              {Localization.sharedValue(
                "RouteDetails_PickupInformation_FulfillerInformation_PhoneNumber"
              )}
            </div>
            <div>{route.fulfiller.contactPhone.toString()}</div>
          </div>
        )}
      </div>
    );
  }

  private renderDriverInformation(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_DriverInformation_Heading")}
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_DriverInformation_Name")}
          </div>
          <div>{route.driver!.name.toString()}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue(
              "RouteDetails_DriverInformation_Fulfiller"
            )}
          </div>
          <div>{route.fulfiller.companyName}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue(
              "RouteDetails_DriverInformation_DriverId"
            )}
          </div>
          <div>
            <div>{route.driver!.id.toString()}</div>
          </div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue(
              "RouteDetails_DriverInformation_PhoneNumber"
            )}
          </div>
          <div>{route.driver!.phone.toString()}</div>
        </div>
      </div>
    );
  }

  private renderVehicleInformation(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_VehicleInformation_Heading")}
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_VehicleInformation_Type")}
          </div>
          <div>{route.driverVehicle!.vehicleType.name}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue(
              "RouteDetails_VehicleInformation_MakeAndModel"
            )}
          </div>
          <div>{route.driverVehicle!.makeAndModel}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_VehicleInformation_Color")}
          </div>
          <div>{route.driverVehicle!.color}</div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue(
              "RouteDetails_VehicleInformation_LicensePlate"
            )}
          </div>
          <div>{route.driverVehicle!.licensePlate}</div>
        </div>
      </div>
    );
  }

  private renderPriceOverview(route: Route) {
    return (
      <div className="c-routeDetails-info-section user-select-text">
        <div className="c-routeDetails-info-section-heading">
          {Localization.sharedValue("RouteDetails_PriceOverview_Heading")}
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_PriceOverview_PriceExVat")}
          </div>
          <div>
            {Localization.formatCurrency(
              route.priceOverview!.priceWithoutVat,
              route.priceOverview!.currencyCode
            )}
          </div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_PriceOverview_Vat")}
          </div>
          <div>
            {Localization.formatCurrency(
              route.priceOverview!.vat,
              route.priceOverview!.currencyCode
            )}
          </div>
        </div>

        <div className="c-routeDetails-info-section-row">
          <div>
            {Localization.sharedValue("RouteDetails_PriceOverview_TotalPrice")}
          </div>
          <div>
            {Localization.formatCurrency(
              route.priceOverview!.totalPrice,
              route.priceOverview!.currencyCode
            )}
          </div>
        </div>
      </div>
    );
  }
}
