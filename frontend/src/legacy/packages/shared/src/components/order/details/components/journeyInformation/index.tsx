import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import { Journey } from "shared/src/model/logistics/order";
import Localization from "../../../../../localization";
import { Link } from "react-router-dom";
import { SubPage } from "shared/src/utillity/page";
import { DateTime } from "luxon";
import { orderDetailsStore } from "../..";
import OrderService from "../../../service";
import { RouteStop } from "shared/src/model/logistics/routes/details/routeStop";
import { Accent } from "../../../../../model/general/accent";
import { Collo } from "shared/src/model/logistics/collo";

interface Props {}

interface State {
  selectedPassageIndex: number;
  stateText: string;
}

@observer
export default class JourneyInformationComponent extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedPassageIndex: -1,
      stateText: Localization.sharedValue("Loading_Headline")
    };
  }

  componentDidMount() {
    this.getJourney();
  }

  getJourney() {
    orderDetailsStore.error = undefined;

    OrderService.getJourney(orderDetailsStore.orderId)
      .then(journey => {
        orderDetailsStore.journey = journey;
        // tslint:disable-next-line:no-console

        // TODO: Change this to include all routes
        orderDetailsStore.routeDetailsService
          .startPolling(journey.passages[0].slug)
          .then(() => {
            // tslint:disable-next-line:no-console
            orderDetailsStore.routeDetailsService.stopPolling();

            var stops = orderDetailsStore.routeDetailsService.routeDetails!.stops.filter(
              s => s instanceof RouteStop
            );
            orderDetailsStore.journey!.passages.map(p => {
              var pickupStop = this.getPickupStop(stops as RouteStop[]);
              var deliveryStop = this.getDeliveryStop(stops as RouteStop[]);

              if (pickupStop && deliveryStop) {
                p.setStops(pickupStop, deliveryStop);
              }
            });

            // Hack to ensure repaint when unobservable data changes
            var temp = orderDetailsStore.journey;
            orderDetailsStore.journey = undefined;
            orderDetailsStore.journey = temp;
          })
          .catch(error => {
            // tslint:disable-next-line:no-console
            console.log(error);
            this.setState({
              stateText: Localization.sharedValue("Loading_Headline:Fail")
            });
            orderDetailsStore.routeDetailsService.stopPolling();
          });
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error);
        orderDetailsStore.loading = false;
      });
  }

  getDeliveryStop(stops: RouteStop[]): RouteStop | undefined {
    stops = stops.filter(
      s =>
        s.deliveries.filter(d => d.orderId === orderDetailsStore.order!.internalOrderId)
          .length > 0
    );

    var stop: RouteStop | undefined = undefined;
    if (stops.length > 0) {
      stop = stops[0];
    }

    return stop;
  }

  getPickupStop(stops: RouteStop[]): RouteStop | undefined {
    stops = stops.filter(
      s =>
        s.pickups.filter(d => d.orderId === orderDetailsStore.order!.internalOrderId).length >
        0
    );

    var stop: RouteStop | undefined = undefined;
    if (stops.length > 0) {
      stop = stops[0];
    }

    return stop;
  }

  renderSection(
    column1?: { headline: string; content: JSX.Element; accent?: Accent },
    column2?: { headline: string; content: JSX.Element; accent?: Accent }
  ) {
    if (column1 == null && column2 == null) {
      return;
    }

    return (
      <div className="c-journeyOverview-passage-section user-select-text">
        <div className="c-journeyOverview-passage-headline font-heading">
          {column1 && (
            <div className="c-journeyOverview-passage-column">
              {column1.headline}
            </div>
          )}
          {column2 && (
            <div className="c-journeyOverview-passage-column">
              {column2.headline}
            </div>
          )}
        </div>
        <div className="c-journeyOverview-passage-values">
          {column1 && (
            <div
              className={`c-journeyOverview-passage-column${
                column1.accent ? " " + column1.accent : ""
              }`}
            >
              {column1.content}
            </div>
          )}
          {column2 && (
            <div
              className={`c-journeyOverview-passage-column${
                column2.accent ? " " + column2.accent : ""
              }`}
            >
              {column2.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  getSelectedCollo(pickup: RouteStop): Collo | undefined {
    var collo: Collo | undefined;
    pickup.pickups.map(p =>
      p.colli.filter(c => {
        if (c.barcode === orderDetailsStore.selectedCollo!.barcode) {
          collo = c;
          return;
        }
      })
    );

    if (collo !== undefined && collo !== undefined) {
      return collo;
    } else {
      return undefined;
    }
  }

  renderContent(pickup: RouteStop, delivery: RouteStop): JSX.Element {
    return (
      <div className="c-journeyOverview-passage-details">
        {this.renderSection(
          {
            headline: Localization.sharedValue(
              "RouteDetails_Stops_Stop_Status"
            ),
            content: (
              <>
                {pickup.status.slug === "completed"
                  ? delivery.status.name
                  : pickup.status.name}
              </>
            ),
            accent:
              pickup.status.slug === "completed"
                ? delivery.status.accent
                : pickup.status.accent
          },
          orderDetailsStore.selectedCollo !== undefined
            ? {
                headline: "Kolli-status",
                content: (
                  <>
                    {this.getSelectedCollo(pickup)
                      ? this.getSelectedCollo(pickup)!.status.name
                      : undefined}
                  </>
                ),
                accent: this.getSelectedCollo(pickup)
                  ? this.getSelectedCollo(pickup)!.status.accent.delivery
                  : undefined
              }
            : undefined
        )}
        {this.renderSection(
          {
            headline: Localization.sharedValue("Address_PickupAddress"),
            content: <>{pickup.location.address.formattedString()}</>
          },
          {
            headline: Localization.sharedValue("Address_DeliveryAddress"),
            content: <>{delivery.location.address.formattedString()}</>
          }
        )}
        {this.renderSection(
          {
            headline: Localization.sharedValue("Departure_TimeFrame"),
            content: (
              <>{Localization.formatTimeRange(pickup.arrivalTimeFrame)}</>
            )
          },
          {
            headline: Localization.sharedValue("Arrival_TimeFrame"),
            content: (
              <>{Localization.formatTimeRange(delivery.arrivalTimeFrame)}</>
            )
          }
        )}
        {this.renderSection(
          delivery.photoRequired
            ? {
                headline: Localization.sharedValue(
                  "RouteDetails_Stops_Stop_Photo"
                ),
                content: (
                  <>
                    <p>
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_PhotoRequired"
                      )}
                    </p>
                    {delivery.photo && (
                      <a
                        className="c-routeDetails-stops-stop-details-linkButton"
                        href={delivery.photo.imageUrl}
                        target="_blank"
                      >
                        {Localization.sharedValue(
                          "RouteDetails_Stops_Stop_SeePhoto"
                        )}
                      </a>
                    )}
                  </>
                )
              }
            : undefined,
          delivery.signatureRequired
            ? {
                headline: Localization.sharedValue(
                  "RouteDetails_Stops_Stop_Signature"
                ),
                content: (
                  <>
                    <p>
                      {Localization.sharedValue(
                        "RouteDetails_Stops_Stop_SignatureRequired"
                      )}
                    </p>

                    {delivery.signature && (
                      <a
                        className="c-routeDetails-stops-stop-details-linkButton"
                        href={delivery.signature.imageUrl}
                        target="_blank"
                      >
                        {Localization.sharedValue(
                          "RouteDetails_Stops_Stop_SeeSignature"
                        )}
                      </a>
                    )}
                  </>
                )
              }
            : undefined
        )}
      </div>
    );
  }

  renderLine(journey: Journey, currentPassageIndex: number) {
    let classNames = "c-journeyOverview-line-circle";

    if (
      journey.passages[currentPassageIndex].pickup.status === "Completed" ||
      journey.passages[currentPassageIndex].delivery.status === "Completed"
    ) {
      classNames += " visited";
    } else if (
      journey.passages[currentPassageIndex].pickup.status === "Arrived" ||
      journey.passages[currentPassageIndex].delivery.status === "Arrived"
    ) {
      classNames += " active";
    }

    return (
      <span className="c-journeyOverview-line">
        <div
          className={
            currentPassageIndex > 0
              ? "c-journeyOverview-line-to active"
              : "c-journeyOverview-line-to"
          }
        />
        <div className={classNames} />
        <div
          className={
            currentPassageIndex !== journey.passages.length - 1
              ? "c-journeyOverview-line-from active"
              : "c-journeyOverview-line-from"
          }
        />
      </span>
    );
  }

  renderTableHeader() {
    return (
      <div className="c-journeyOverview-passages-header">
        <p className="font-small">{Localization.sharedValue("Passage_Route")}</p>
        <p className="font-small">{Localization.sharedValue("Passage_Driver")}</p>
        <p className="font-small">{Localization.sharedValue("Passage_Date")}</p>
        <p className="font-small">
          {Localization.sharedValue("Passage_DepartureTime")}
        </p>
        <p className="font-small">{Localization.sharedValue("Passage_ArrivalTime")}</p>
        <p className="font-small">{Localization.sharedValue("Passage_RouteId")}</p>
        <p />
      </div>
    );
  }

  renderJourneyPassages(journey: Journey) {
    let passages: JSX.Element[] = [];
    let classNames = "c-journeyOverview-passage";

    journey.passages.map((passage, index) => {
      passages.push(
        <div
          key={"passage-" + passage.slug}
          className={
            this.state.selectedPassageIndex === index && passage.pickupStop && passage.deliveryStop
              ? classNames + " active"
              : classNames
          }
        >
          <div
            onClick={() => this.setState({ selectedPassageIndex: index })}
            className="c-journeyOverview-passage-header suppress-double-click"
          >
            <p>{index + 1}</p>
            <p>{passage.driver.firstName + " " + passage.driver.lastName}</p>
            <p>{passage.pickup.arrivalTime.toLocaleString()}</p>
            <p>
              {passage.pickup.arrivalTime.toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
            </p>
            <p>
              {passage.delivery.arrivalTime.toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
            </p>
            <p>
              {passage.slug ? (
                <Link
                  key={"stop" + (index + 1) + "-" + (index + 2) + "slug"}
                  to={SubPage.path(SubPage.RouteDetails).replace(
                    ":id",
                    passage.slug
                  )}
                >
                  {"#" + passage.slug}
                </Link>
              ) : (
                "--"
              )}
            </p>
            <p>
              {passage.pickupStop && passage.deliveryStop &&
              <img
                className="accordionChevron"
                src={require("../../assets/chevron.svg")}
              />}
            </p>
          </div>

          {this.renderLine(journey, index)}
          {passage.pickupStop &&
            passage.deliveryStop &&
            this.renderContent(passage.pickupStop, passage.deliveryStop)}
        </div>
      );
    });

    return <div className="c-journeyOverview-passages">{passages}</div>;
  }

  render() {
    if (orderDetailsStore.journey) {
      return (
        <div className="c-journeyOverview">
          <h4 className="c-journeyOverview-headline font-heading">
            {Localization.operationsValue("Order_Details_DeliveryOverview")}
          </h4>
          <div className="c-journeyOverview-passages">
            {this.renderTableHeader()}
            {this.renderJourneyPassages(orderDetailsStore.journey)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="c-journeyOverview">
          <h4 className="font-heading">{this.state.stateText}</h4>
        </div>
      );
    }
  }
}
